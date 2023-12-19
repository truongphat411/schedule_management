const db = require('../config/db.config');
const { 
    createNewInstructor: createNewInstructorQuery,
    findInstructorById: findInstructorByIdQuery,
    updateInstructorById: updateInstructorByIdQuery,
    deleteInstructorById: deleteInstructorById,
    getInstructorsByDepartmentID: getInstructorsByDepartmentIDQuery,
    getInstructorsFromTimeTable: getInstructorsFromTimeTableQuery,
    getInstructors: getInstructorsQuery
} = require('../database/queries');
const { logger } = require('../utils/logger');

class Instructor {
    constructor(id,instructor_name) {
        this.id = id;
        this.instructor_name = instructor_name;
    }

    getId() {
        return this.id;
      }
    
    getName() {
        return this.instructor_name;
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
                    const instructor = res[0];
                    instructor.department = JSON.parse(instructor.department);
                    cb(null, instructor);
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
        ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    instructor_name: instructor.instructor_name,
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

    static getInstructors(department_id, cb) {
        db.query(getInstructorsByDepartmentIDQuery,department_id, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                if(res.length){
                    cb(null, res);
                    return;
                }
                
        });
    }

    static getInstructorsFromTimetable(department_id, semester_id, cb) {
        db.query(getInstructorsFromTimeTableQuery, [
            department_id,
            semester_id
        ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                if(res.length){
                    cb(null, res);
                    return;
                }
                
        });
    }

    static readAll(cb) {
        db.query(getInstructorsQuery, (err, res) => {
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

module.exports = Instructor;