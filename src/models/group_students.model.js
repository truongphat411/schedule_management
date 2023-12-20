const db = require('../config/db.config');
const { 
    getGroupStudents: getGroupStudentsQuery,
} = require('../database/queries');
const { logger } = require('../utils/logger');
class GroupStudents {
    constructor(id, group_name, number_of_students, department_id) {
        this.id = id;
        this.group_name = group_name;
        this.number_of_students = number_of_students;
        this.department_id = department_id;
    }

    getId() {
        return this.id;
      }
    
    getGroupName() {
        return this.group_name;
    }

    getNumberOfStudents() {
        return this.number_of_students;
    }

    getDepartmentId() {
        return this.department_id;
    }

    static readAll(cb) {
        db.query(getGroupStudentsQuery, (err, res) => {
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

module.exports = GroupStudents;