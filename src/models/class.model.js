const db = require('../config/db.config');

class Class {
    constructor(id, department, course) {
        this.id = id;
        this.course = course;
        this.instructor = null;
        this.meetingTime = null;
        this.room = null;
        this.department = department;
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
    return this.department;
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