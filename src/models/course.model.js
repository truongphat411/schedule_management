const db = require('../config/db.config');
const { 
    createNewCourse: createNewCourseQuery, 
    findCourseById: findCourseByIdQuery,
    updateCourseById: updateCourseByIdQuery,
    deleteCourseById: deleteCourseByIdQuery,
    createNewCourseInstructor: createNewCourseInstructorQuery
    } = require('../database/queries');
const { logger } = require('../utils/logger');

class Course {
    constructor(id,course_name, credits, maxNumberOfStudents, instructors) {
        this.id = id;
        this.course_name = course_name;
        this.credits = credits;
        this.maxNumberOfStudents = maxNumberOfStudents;
        this.instructors = instructors;
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

    getInstructors(){
        return this.instructors;
    }

    
    static create(newCourse, major_id, cb) {
        var course_id;
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
                course_id = res.insertId,

                db.query(createNewCourseInstructorQuery, 
                    [
                        course_id,
                        major_id,
                    ], (err, res) => {
                        if (err) {
                            logger.error(err.message);
                            cb(err, null);
                            return;
                        }
                        cb(null, {message: 'Course deleted successfully'});
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
                    // Split the majorString into individual JSON objects
                    const majorObjects = res[0].major.split("},{");
                    
                    // Process each major object
                    const majorArray = majorObjects.map(majorObj => {
                    // If it's not the first object, add '{' at the beginning
                    if (majorObj.indexOf('{') !== 0) {
                    majorObj = '{' + majorObj;
                    }
                    // If it's not the last object, add '}' at the end
                    if (majorObj.lastIndexOf('}') !== majorObj.length - 1) {
                    majorObj = majorObj + '}';
                    }
                
                    // Now, majorObj should be a valid JSON string
                    // You can safely parse it
                    return JSON.parse(majorObj);
                    });

                    cb(null, {
                        id: res[0].id,
                        course_name: res[0].course_name,
                        credits: res[0].credits,
                        maxNumberOfStudents: res[0].maxNumberOfStudents,
                        major: majorArray
                    });
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