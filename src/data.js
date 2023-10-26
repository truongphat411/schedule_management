const Course = require('./models/course.model');
const db = require('./config/db.config');
const util = require('util');
const Room = require('./models/room.model');
const MeetingTime = require('./models/meeting_time.model');
const Instructor = require('./models/instructor.model');

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
            const meeting_time = new MeetingTime(i.id,i.day,i.start_time,i.end_time);
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
        const rsc = await async_get_query("SELECT c.id AS course_id, c.course_name, GROUP_CONCAT(i.instructor_name) AS list_instructor FROM course c, JOIN course_instructor ci ON c.id = ci.id_course, JOIN instructor i ON ci.id_instructor = i.id, GROUP BY c.id, c.course_name");
        const c = [];
        for (let i of rsc) {
            const course = new Course();
            c.push(course);
        }
        this.course = c;

    }

    getRoom(){
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

    getDepartment(){
        return this.depts;
    }

}

async function async_get_query(sql_query) {
    return util.promisify(db.query).call(db, sql_query);
} 

async function async_push_query(sql_query, info) {
    return util.promisify(db.query).call(db, sql_query, info);
}

module.exports = Data;

