const db = require('../config/db.config');

class MeetingTime {
    constructor(day, start_time,end_time) {
        this.day = day;
        this.start_time = start_time;
        this.end_time = end_time;
    }
}

module.exports = MeetingTime;