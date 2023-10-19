const db = require('../config/db.config');
const { createNewCourse: createNewCourseQuery,} = require('../database/queries');
const { logger } = require('../utils/logger');

class MeetingTime {
    constructor(day, start_time,end_time) {
        this.day = day;
        this.start_time = start_time;
        this.end_time = end_time;
    }
   
    static create(newMeetingTime, cb) {
        db.query(createNewCourseQuery, 
            [
                newMeetingTime.day, 
                newMeetingTime.start_time,
                newMeetingTime.end_time,
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    day: newMeetingTime.day,
                    start_time: newMeetingTime.start_time,
                    end_time: newMeetingTime.end_time
                });
        });
    }
}

module.exports = MeetingTime;