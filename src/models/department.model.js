const db = require('../config/db.config');
const { 
  getDepartment: getDepartmentQuery,
  } = require('../database/queries');

class Department {
    constructor(id,department_name,courses) {
      this.id = id;
      this.department_name = department_name;
      this.listCourse = courses;
    }

      getDepartmentName() {
        return this.department_name;
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