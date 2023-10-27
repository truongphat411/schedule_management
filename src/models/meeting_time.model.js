const db = require('../config/db.config');

class MeetingTime {
    constructor(id,time) {
        this.id = id;
        this.time = time;
    }

    getId(){
        return this.id;
    }

    getTime(){
        return this.time;
    }
}

module.exports = MeetingTime;