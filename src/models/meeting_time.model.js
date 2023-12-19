const db = require('../config/db.config');
const { 
    getMeetingTime: getMeetingTimeQuery,
} = require('../database/queries');
const { logger } = require('../utils/logger');

class MeetingTime {
    constructor(id,time,time_start,daysOfTheWeek, sessionsDuringTheDay) {
        this.id = id;
        this.time = time;
        this.time_start = time_start;
        this.daysOfTheWeek = daysOfTheWeek;
        this.sessionsDuringTheDay = sessionsDuringTheDay;
    }

    getId(){
        return this.id;
    }

    getTime(){
        return this.time;
    }

    getTimeStart(){
        return this.time_start;
    }

    getDaysOfTheWeek(){
        return this.daysOfTheWeek;
    }

    getSessionsDuringTheDay(){
        return this.sessionsDuringTheDay;
    }

    static readAll(cb) {
        db.query(getMeetingTimeQuery, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                if (res.length) {
                    cb(null, res);
                    return;
                }
                cb({ kind: "not_found" }, null);
        });
    }
}

module.exports = MeetingTime;