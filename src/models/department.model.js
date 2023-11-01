const db = require('../config/db.config');
const { 
  getDepartment: getDepartmentQuery,
  } = require('../database/queries');

class Department {
    constructor(major_name,listCourse) {
        this.major_name = major_name;
    this.listCourse = listCourse;
    }

      getMajorName() {
        return this.major_name;
      }
    
      getCourses() {
        return this.listCourse;
      }

      static getDepartments(cb) {
        db.query(getDepartmentQuery, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, res);
        });
    }

}

module.exports = Department;