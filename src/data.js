const Course = require('./models/course.model');
const db = require('./config/db.config');
const util = require('util');
const Room = require('./models/room.model');
const MeetingTime = require('./models/meeting_time.model');
const Instructor = require('./models/instructor.model');
const Department = require('./models/department.model');
const Semester = require('./models/semester.model');
const GroupStudents = require('./models/group_students.model');

class Data {

    constructor(){
        this.room = [];
        this.instructors  = [];
        this.courses = [];
        this.depts = [];
        this.meetingTimes = [];
        this.group_students = [];
        this.semester = [];
        this.numberOfClasses  = 0;
    }


    async initialize(department_id, semester_id) {
        //// Room
        const rsr = await async_get_query("SELECT * FROM room");
        const r = [];
        for (let i of rsr) {
            const room = new Room(i.id,i.room_name,i.capacity,i.area_id);
            r.push(room);
        }
        this.room = r;
        //// MeetingTime
        const rsmt = await async_get_query("SELECT id,time,time_start,days_of_the_week,sessions_during_the_day FROM meeting_time;");
        const mt = [];
        for (let i of rsmt) {
            const meeting_time = new MeetingTime(i.id,i.time,i.time_start,i.days_of_the_week,i.sessions_during_the_day);
            mt.push(meeting_time);
        }
        this.meetingTimes = mt;
        //// Instructor
        const rsinstr = await async_push_query("SELECT * FROM instructor");
        const instr = [];
        for (let i of rsinstr) {
            const instructor = new Instructor(i.id,i.instructor_name,i.email,i.number_phone,i.gender,i.department_id);
            instr.push(instructor);
        }
        this.instructors = instr;

        //// Group_students
        const rsgrstud = await async_push_query(`
        SELECT * FROM group_students`);
        const grstud = [];
        for (let i of rsgrstud) {
            const group_students = new GroupStudents(i.id,i.group_name,i.number_of_students,i.department_id);
            grstud.push(group_students);
        }
        this.group_students = grstud;

        //// Course
        const rsc = await async_push_query(`
        SELECT
        c.id,
        c.course_name,
        c.credits,
        GROUP_CONCAT(json_object(
        'id', i.id,
        'instructor_name', i.instructor_name,
        'email', i.email,
        'number_phone', i.number_phone,
        'gender', i.gender,
        'department_id', i.department_id
        )) AS  listInstructor
        FROM course c
        JOIN instructor_course ic ON c.id = ic.course_id
        JOIN department d ON d.id = c.department_id
        JOIN instructor i ON ic.instructor_id = i.id
        GROUP BY c.id, c.course_name, c.credits
        `,);
        const c = [];
        for (let i of rsc) {
            const instructorArray = JSON.parse(`[${i.listInstructor}]`);
            const instructors = instructorArray.map((instructor) => new Instructor(instructor.id, instructor.instructor_name,instructor.email,instructor.number_phone,instructor.gender,instructor.department_id));
            const course = new Course(i.id,i.course_name,i.credits,instructors);
            c.push(course);
        }
        this.courses = c;

        const rsdept = await async_get_query(`
        SELECT * FROM department
        `);
        const rsgrst = await async_get_query(`
        SELECT * FROM group_students
        `);
        const dept = [];
        for (let i of rsdept) {
            try {
                const rsc = await async_push_query(`
                SELECT
                c.id,
                c.course_name,
                c.credits,
                GROUP_CONCAT(json_object(
                'id', i.id,
                'instructor_name', i.instructor_name,
                'email', i.email,
                'number_phone', i.number_phone,
                'gender', i.gender,
                'department_id', i.department_id
                )) AS  listInstructor
                FROM course c
                JOIN instructor_course ic ON c.id = ic.course_id
                JOIN department d ON d.id = c.department_id
                JOIN instructor i ON ic.instructor_id = i.id
                WHERE d.id = ?
                GROUP BY c.id, c.course_name, c.credits `,i.id);
                const courses = [];
                for(let c of rsc) {
                    const instructorArray = JSON.parse(`[${c.listInstructor}]`);
                    const instructors = instructorArray.map((instructor) => new Instructor(instructor.id, instructor.instructor_name,instructor.email,instructor.number_phone,instructor.gender,instructor.department_id));
                    const course = new Course(c.id,c.course_name,c.credits,instructors);
                    courses.push(course);
                }
                const rsgr = await async_push_query(`select * from group_students where department_id = ?`,i.id);
                const group_students = [];
                for(let d of rsgr) {
                    const group = new GroupStudents(d.id,d.group_name,d.number_of_students,d.department_id);
                    group_students.push(group);
                }
                const department = new Department(i.id, i.department_name, courses, group_students);
                dept.push(department);
            } catch (error) {
                console.error("Error parsing courses:", error);
            }
        }
        this.depts = dept;

        this.depts.forEach((department) => {
            this.numberOfClasses += department.getCourses().length;
          });
    }

    async getClass(department_id, semester_id) {
        const rsc = await async_push_query(`
        SELECT * FROM class WHERE department_id = ? AND semester_id = ?
        `, [department_id, semester_id])
        const classes = [];
        for(let x of rsc) {
            const course = await async_push_query(`
            SELECT * FROM course WHERE id = ? LIMIT 1
            `, x.course_id);
            const instructor = await async_push_query(`
            SELECT * FROM instructor WHERE id = ? LIMIT 1
            `, x.instructor_id)
            const room = await async_push_query(`
            SELECT * FROM room WHERE id = ? LIMIT 1
            `, x.room_id);
            const meeting_time = await async_push_query(`
            SELECT * FROM meeting_time WHERE id = ? LIMIT 1
            `, x.meeting_time_id);
            const department = await async_push_query(`
            SELECT * FROM department WHERE id = ? LIMIT 1
            `, x.department_id);
            const group_students = await async_push_query(`
            SELECT * FROM group_students WHERE id = ? LIMIT 1
            `, x.group_students_id);
            classes.push({
                id: x.id,
                course: course,
                instructor: instructor,
                room: room,
                meeting_time: meeting_time,
                department: department,
                group_students: group_students
            });
        }
        return classes;
    }

    async getClassById(class_id) {
        const rsc = await async_push_query(`
        SELECT * FROM class WHERE id = ? LIMIT 1
        `, [class_id]);
        const classes = [];
        for(let x of rsc) {
            const course = await async_push_query(`
            SELECT * FROM course WHERE id = ? LIMIT 1
            `, x.course_id);
            const instructor = await async_push_query(`
            SELECT * FROM instructor WHERE id = ? LIMIT 1
            `, x.instructor_id)
            const room = await async_push_query(`
            SELECT * FROM room WHERE id = ? LIMIT 1
            `, x.room_id);
            const meeting_time = await async_push_query(`
            SELECT * FROM meeting_time WHERE id = ? LIMIT 1
            `, x.meeting_time_id);
            const department = await async_push_query(`
            SELECT * FROM department WHERE id = ? LIMIT 1
            `, x.department_id);
            const group_students = await async_push_query(`
            SELECT * FROM group_students WHERE id = ? LIMIT 1
            `, x.group_students_id);
            classes.push({
                id: x.id,
                course: course,
                instructor: instructor,
                room: room,
                meeting_time: meeting_time,
                department: department,
                group_students: group_students
            });
        }
        return classes;
    }


    getRooms(){
        return this.room;
    }

    getMeetingTimes(){
        return this.meetingTimes;
    }

    getCourses(){
        return this.courses;
    }

    getInstructors(){
        return this.instructors;
    }

    getDepts(){
        return this.depts;
    }

    getGroupStudents(){
        return this.group_students;
    }

    getNumberOfClasses(){
        return this.numberOfClasses;
    }

}

async function async_get_query(sql_query) {
    return util.promisify(db.query).call(db, sql_query);
} 

async function async_push_query(sql_query, info) {
    return util.promisify(db.query).call(db, sql_query, info);
}

module.exports = Data;

