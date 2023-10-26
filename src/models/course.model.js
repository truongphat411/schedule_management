const db = require('../config/db.config');
const { 
    createNewCourse: createNewCourseQuery, 
    findCourseById: findCourseByIdQuery,
    updateCourseById: updateCourseByIdQuery,
    deleteCourseById: deleteCourseByIdQuery
    } = require('../database/queries');
const { logger } = require('../utils/logger');

class Course {
    constructor(id,course_name, credits, maxNumberOfStudents, listInstructor) {
        this.id = id;
        this.course_name = course_name;
        this.credits = credits;
        this.maxNumberOfStudents = maxNumberOfStudents;
        this.listInstructor = listInstructor;
    }

    getCourseId(){
        return this.id;
    }

    getCourseName() {
        return this.course_name;
    }

    getCredits(){
        return this.credits;
    }

    getMaxNumberOfStudents(){
        return this.maxNumberOfStudents;
    }

    getListInstructor(){
        return this.listInstructor;
    }

    
    static create(newCourse, cb) {
        db.query(createNewCourseQuery, 
            [
                newCourse.course_name, 
                newCourse.credits,
                newCourse.maxNumberOfStudents,
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    course_name: newCourse.course_name,
                    credits: newCourse.credits,
                    maxNumberOfStudents: newCourse.maxNumberOfStudents
                });
        });
    }

    static read(courseId, cb) {
        db.query(findCourseByIdQuery, courseId, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                if (res.length) {
                    cb(null, res[0]);
                    return;
                }
                cb({ kind: "not_found" }, null);
        });
    }

    static update(course, cb) {
        db.query(updateCourseByIdQuery, 
        [   
            course.course_name,
            course.credits,
            course.maxNumberOfStudents,
        ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    course_name: course.course_name,
                    credits: course.credits,
                    maxNumberOfStudents: course.maxNumberOfStudents,
                });
        });
    }

    static delete(courseId, cb) {
        db.query(deleteCourseByIdQuery, courseId, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {message: 'Course deleted successfully'})
        });
    }
}

module.exports = Course;