const db = require('../config/db.config');

class MeetingTime {
    constructor(id,day, start_time,end_time) {
        this.id = id;
        this.day = day;
        this.start_time = start_time;
        this.end_time = end_time;
    }
}

module.exports = MeetingTime;