const db = require('../config/db.config');

class MeetingTime {
    constructor(id,day, start_time,end_time) {
        this.id = id;
        this.day = day;
        this.start_time = start_time;
        this.end_time = end_time;
    }

    getDay(){
        return this.day;
    }

    getStartTime(){
        return this.start_time;
    }

    getEndTime(){
        return this.end_time;
    }
}

module.exports = MeetingTime;