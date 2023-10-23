const db = require('../config/db.config');
const { 
    createNewInstructor: createNewInstructorQuery,
    findInstructorById: findInstructorByIdQuery,
    updateInstructorById: updateInstructorByIdQuery,
    deleteInstructorById: deleteInstructorById,
} = require('../database/queries');
const { logger } = require('../utils/logger');

class Instructor {
    constructor(instructor_name, major_id) {
        this.instructor_name = instructor_name;
        this.major_id = major_id;
    }
   
    static create(newInstructor, cb) {
        db.query(createNewInstructorQuery, 
            [
                newInstructor.instructor_name,
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    instructor_name: newInstructor.instructor_name,
                    major_id: newInstructor.major_id,
                });
        });
    }

    static read(instructorId, cb) {
        db.query(findInstructorByIdQuery, instructorId, (err, res) => {
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

    static update(instructor, cb) {
        db.query(updateInstructorByIdQuery, 
        [   
            instructor.instructor_name,
            instructor.major_id,
        ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    instructor_name: instructor.instructor_name,
                    major_id: instructor.major_id,
                });
        });
    }

    static delete(courseId, cb) {
        db.query(deleteInstructorById, courseId, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {message: 'Instructor deleted successfully'})
        });
    }
}

module.exports = Instructor;