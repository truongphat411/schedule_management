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
            const room = new Room(i.id,i.room_name,i.capacity,i.area_id,i.kind_of_room_id);
            r.push(room);
        }
        this.room = r;
        //// MeetingTime
        const rsmt = await async_get_query("SELECT * FROM meeting_time");
        const mt = [];
        for (let i of rsmt) {
            const meeting_time = new MeetingTime(i.id,i.time,i.time_start,i.daysOfTheWeek,i.sessionsDuringTheDay);
            mt.push(meeting_time);
        }
        this.meetingTimes = mt;
        //// Instructor
        const rsinstr = await async_get_query("SELECT * FROM instructor");
        const instr = [];
        for (let i of rsinstr) {
            const instructor = new Instructor(i.id,i.instructor_name);
            instr.push(instructor);
        }
        this.instructors = instr;

        //// Group_students
        const rsgrstud = await async_push_query(`
        SELECT * FROM group_students WHERE department_id = ?
        `, department_id);
        const grstud = [];
        for (let i of rsgrstud) {
            const group_students = new GroupStudents(i.id,i.group_name,i.numberOfStudents,i.department_id);
            grstud.push(group_students);
        }
        this.group_students = grstud;

        //// Course
        const rsc = await async_get_query(`
        SELECT
        c.id,
        c.course_name,
        c.credits,
        c.maxNumberOfStudents,
        GROUP_CONCAT(json_object(
        'id', s.id,
        'semester_name', s.semester_name
        )) AS  semester,
        GROUP_CONCAT(json_object(
        'id', i.id,
        'instructor_name', i.instructor_name
        )) AS  listInstructor
        FROM course c
        JOIN course_instructor ci ON c.id = ci.course_id
        JOIN instructor i ON ci.instructor_id = i.id
        JOIN semester s ON c.semester_id = s.id
        GROUP BY c.id, c.course_name, c.credits, c.maxNumberOfStudents
        `);
        const c = [];
        for (let i of rsc) {
            // Parse the JSON string into an array of instructor objects
            const instructorArray = JSON.parse(`[${i.listInstructor}]`);
            // Create an array of instructor objects
            const instructors = instructorArray.map((instructor) => new Instructor(instructor.id, instructor.instructor_name));
            const semesterArray = JSON.parse(`[${i.semester}]`);
            const semesters = semesterArray.map((semester) => new Semester(semester.id, semester.semester_name));
            const course = new Course(i.id,i.course_name,i.credits,i.maxNumberOfStudents,semesters,instructors);
            c.push(course);
        }
        this.courses = c;

        const rsdept = await async_push_query(`
        SELECT
        d.id,
        d.department_name,
        GROUP_CONCAT(json_object(
        'id', c.id,
        'course_name', c.course_name,
        'credits', c.credits,
        'maxNumberOfStudents', c.maxNumberOfStudents
        )) AS courses
        FROM department d
        JOIN department_course dc ON d.id = dc.department_id
        JOIN course c ON dc.course_id = c.id
        WHERE d.id = ? AND c.semester_id = ?
        GROUP BY d.id, d.department_name
        `, [department_id, semester_id]);
        const rsgrst = await async_push_query(`
        SELECT * FROM group_students WHERE department_id = ?
        `, department_id);
        const dept = [];
        for (let i of rsdept) {
            try {
                const courseArray = JSON.parse(`[${i.courses}]`);
                const courses = [];
                for (let x of courseArray) {
                    for (let y of this.courses) {
                        if (x.id === y.id) {
                            const course = new Course(x.id, x.course_name, x.credits, x.maxNumberOfStudents, y.semester, y.instructors);
                            courses.push(course);
                        }
                    }
                }
                const students = [];
                for (let x of rsgrst) {
                    for (let y of this.group_students) {
                        if (x.id === y.id) {
                            const group = new GroupStudents(x.id, x.group_name, x.numberOfStudents, x.department_id);
                            students.push(group);
                        }
                    }
                }
                const department = new Department(i.id, i.department_name, courses, students);
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
        var date;
        if(semester_id === 1) {
            date = '21/8/2023 - 29/10/2023'
          } else if (semester_id === 2) {
            date = '13/11/2023 - 08/01/2023'
          } else if (semester_id === 3) {
            date = '21/01/2023 - 04/03/2024'
          } else {
            date = '24/03/2023 - 05/05/2023'
          }
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

