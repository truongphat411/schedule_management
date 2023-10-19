const db = require('../config/db.config');

class Class {
    constructor(course_id, instructor_id, meeting_time_id, room_id) {
        this.course_id = course_id;
        this.instructor_id = instructor_id;
        this.meeting_time_id = meeting_time_id;
        this.room_id = room_id;
    }
}

module.exports = Class;