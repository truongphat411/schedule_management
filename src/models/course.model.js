const db = require('../config/db.config');
const { createNewCourse: createNewCourseQuery,} = require('../database/queries');
const { logger } = require('../utils/logger');

class Course {
    constructor(course_name, maximum_number_of_student) {
        this.course_name = course_name;
        this.maximum_number_of_student = maximum_number_of_student;
    }
   
    static create(newCourse, cb) {
        db.query(createNewCourseQuery, 
            [
                newCourse.course_name, 
                newCourse.max,
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    course_name: newCourse.course_name,
                    maximum_number_of_student: newCourse.maximum_number_of_student
                });
        });
    }
}

module.exports = Course;