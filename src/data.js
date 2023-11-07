const Course = require('./models/course.model');
const db = require('./config/db.config');
const util = require('util');
const Room = require('./models/room.model');
const MeetingTime = require('./models/meeting_time.model');
const Instructor = require('./models/instructor.model');
const Department = require('./models/department.model');

class Data {

    constructor(){
        this.room = [];
        this.instructors  = [];
        this.courses = [];
        this.depts = [];
        this.meetingTimes = [];
        this.numberOfClasses  = 0;
    }


    async initialize() {
        //// Room
        const rsr = await async_get_query("SELECT * FROM room");
        const r = [];
        for (let i of rsr) {
            const room = new Room(i.id,i.room_name,i.capacity);
            r.push(room);
        }
        this.room = r;
        //// MeetingTime
        const rsmt = await async_get_query("SELECT * FROM meeting_time");
        const mt = [];
        for (let i of rsmt) {
            const meeting_time = new MeetingTime(i.id,i.time);
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
        //// Course
        const rsc = await async_get_query(`
        SELECT
        c.id,
        c.course_name,
        c.credits,
        c.maxNumberOfStudents,
        GROUP_CONCAT(json_object(
        'id', i.id,
        'instructor_name', i.instructor_name
        )) AS  listInstructor
        FROM course c
        JOIN course_instructor ci ON c.id = ci.course_id
        JOIN instructor i ON ci.instructor_id = i.id
        GROUP BY c.id, c.course_name, c.credits, c.maxNumberOfStudents
        `);
        const c = [];
        for (let i of rsc) {
            // Parse the JSON string into an array of instructor objects
            const instructorArray = JSON.parse(`[${i.listInstructor}]`);
            // Create an array of instructor objects
            const instructors = instructorArray.map((instructor) => new Instructor(instructor.id, instructor.instructor_name));
            const course = new Course(i.id,i.course_name,i.credits,i.maxNumberOfStudents,instructors);
            c.push(course);
        }
        this.courses = c;

        const rsdept = await async_get_query(`
        SELECT
        d.department_name,
        GROUP_CONCAT(json_object(
        'id', c.id,
        'course_name', c.course_name,
        'credits', c.credits,
        'maxNumberOfStudents', c.maxNumberOfStudents
        )) AS listCourse
        FROM department d
        LEFT JOIN department_course dc ON d.id = dc.department_id
        LEFT JOIN course c ON dc.course_id = c.id
        GROUP BY d.department_name
        `);
        const dept = [];
        for (let i of rsdept) {
            // Parse the JSON string into an array of course objects
            const courseArray = JSON.parse(`[${i.listCourse}]`);
            // Create an array of course objects
            const courses = [];
            for (let x of courseArray) {
                for(let y of this.courses){
                    if(x.id === y.id){
                        const course = new Course(x.id, x.course_name, x.credits, x.maxNumberOfStudents, y.instructors);
                        courses.push(course);
                    }
                }
            }
            // const courses = courseArray.map((course) => new Course(course.id, course.course_name, course.credits, course.maxNumberOfStudents, null));
            const department = new Department(i.major_name,courses);
            dept.push(department);
        }
        this.depts = dept;

        this.depts.forEach((department) => {
            this.numberOfClasses += department.getCourses().length;
          });
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

