const db = require('../config/db.config');
const { 
  getDepartment: getDepartmentQuery,
  getDepartmentInClass: getDepartmentInClassQuery
  } = require('../database/queries');

class Department {
    constructor(id,department_name,courses, group_students) {
      this.id = id;
      this.department_name = department_name;
      this.courses = courses;
      this.group_students = group_students;
    }

      getDepartmentName() {
        return this.department_name;
      }
    
      getCourses() {
        return this.courses;
      }

      getGroupStudents() {
        return this.group_students;
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

    static getDepartmentInClass(cb) {
      db.query(getDepartmentInClassQuery, (err, res) => {
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