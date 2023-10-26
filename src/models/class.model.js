const db = require('../config/db.config');

class Class {
    constructor(id,course, instructor, meetingTime, room, dept) {
        this.id = id;
        this.course = course;
        this.instructor = instructor;
        this.meetingTime = meetingTime;
        this.room = room;
        this.dept = dept;
    }

    setInstructor(instructor) {
        this.instructor = instructor;
    }
    
    setMeetingTime(meetingTime) {
        this.meetingTime = meetingTime;
    }
    
    setRoom(room) {
        this.room = room;
    }

    getId() {
    return this.id;
    }

    getDept() {
    return this.dept;
    } 

    getCourse() {
    return this.course;
    }

    getInstructor() {
    return this.instructor;
    }

    getMeetingTime() {
    return this.meetingTime;
    }

    getRoom() {
    return this.room;
    }

}

module.exports = Class;