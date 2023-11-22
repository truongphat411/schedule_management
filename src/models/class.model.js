class Class {
    constructor(id, group_students, department, course) {
        this.id = id;
        this.group_students = group_students;
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

    getGroupStudents() {
        return this.group_students;
    }
}

module.exports = Class;