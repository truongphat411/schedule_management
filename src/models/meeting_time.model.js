const db = require('../config/db.config');
const { 
    getMeetingTime: getMeetingTimeQuery,
} = require('../database/queries');
const { logger } = require('../utils/logger');

class MeetingTime {
    constructor(id,time,time_start,days_of_the_week, sessions_during_the_day) {
        this.id = id;
        this.time = time;
        this.time_start = time_start;
        this.days_of_the_week = days_of_the_week;
        this.sessions_during_the_day = sessions_during_the_day;
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
        return this.days_of_the_week;
    }

    getSessionsDuringTheDay(){
        return this.sessions_during_the_day;
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