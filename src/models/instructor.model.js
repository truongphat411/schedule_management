const db = require('../config/db.config');
const { createNewInstructor: createNewInstructorQuery,} = require('../database/queries');
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
                newInstructor.major_id,
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    instructor_name: newInstructor.instructor_name,
                    major_id: newInstructor.major_id
                });
        });
    }
}

module.exports = Instructor;