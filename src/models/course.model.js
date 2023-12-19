const db = require('../config/db.config');
const { 
    createNewCourse: createNewCourseQuery, 
    findCourseById: findCourseByIdQuery,
    updateCourseById: updateCourseByIdQuery,
    deleteCourseById: deleteCourseByIdQuery,
    createNewCourseInstructor: createNewCourseInstructorQuery,
    getCoursesByDepartment: getCoursesByDepartmentQuery,
    getCourses: getCoursesQuery
    } = require('../database/queries');
const { logger } = require('../utils/logger');

class Course {
    constructor(id,course_name, credits, instructors) {
        this.id = id;
        this.course_name = course_name;
        this.credits = credits;
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

    getInstructors(){
        return this.instructors;
    }


    
    static create(newCourse, cb) {
        var course_id;
        db.query(createNewCourseQuery, 
            [
                newCourse.course_name, 
                newCourse.credits,
                newCourse.department_id,
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
                    const course = res[0];
                    course.department = JSON.parse(course.department);
                    cb(null, course);
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

    static getCoursesByDepartment(departmentId, cb) {
        db.query(getCoursesByDepartmentQuery, departmentId, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                if (res.length) {
                    const coursesWithParsedJSON = res.map(course => {
                        return {
                            ...course,
                            department: JSON.parse(course.department),
                        };
                    });
                    cb(null, coursesWithParsedJSON);
                    return;
                }
        });
    }

    static readAll(cb) {
        db.query(getCoursesQuery, (err, res) => {
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

module.exports = Course;