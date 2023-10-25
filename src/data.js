const Course = require('./models/course.model');
const db = require('./config/db.config');
const util = require('util');
const Room = require('./models/room.model');


class Data {

    constructor(){
        this.room = [];
        this.instructors  = [];
        this.course = [];
        this.depts = [];
        this.meetingTimes = [];
        this.numberOfClasses  = 0;
    }

    async initialize(){
        const rsRoom = uery("SELECT * FROM room");
        const r = [];
        for (let i of rsRoom) {
            const room = new Room(i.id,i.room_name,i.capacity);
            r.push(room);
        }
        console.log('Room: ', r);
    }
}


function async_get_query(sql_query) {
    return util.promisify(db.query).call(db, sql_query);
} 

function async_push_query(sql_query, info) {
    return util.promisify(db.query).call(db, sql_query, info);
}

const i = [];
const c = [];
const numberOfClasses = 0;

async function initialize(){
    const rsRoom = uery("SELECT * FROM room");
    const r = [];
    for (let i of rsRoom) {
        const room = new Room(i.id,i.room_name,i.capacity);
        r.push(room);
    }
    console.log('Room: ', r);
}


async function getCourses(){
    const result = await async_get_query("SELECT * FROM course");
    const courses = [];
    for(let i of result){
        const course = new Course();
        course.id = i.id;
        course.course_name = i.course_name;
        course.credits = i.credits;
        courses.push(course);
    }
    console.log('Courses: ', courses);
    return courses;
}

async function getInstructor(){
    const result = await async_get_query("SELECT * FROM course");
    const courses = [];
    for(let i of result){
        const course = new Course();
        course.id = i.id;
        course.course_name = i.course_name;
        course.credits = i.credits;
        courses.push(course);
    }
    console.log('Courses: ', courses);
    return courses;
}

module.exports = {
    getCourse,
}

