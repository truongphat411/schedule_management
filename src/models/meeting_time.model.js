const db = require('../config/db.config');

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
}

module.exports = MeetingTime;