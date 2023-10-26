const db = require('../config/db.config');

class Department {
    constructor(dept_name,listCourse) {
        this.dept_name = dept_name;
    this.listCourse = listCourse;
    }

    getDeptName() {
        return this.deptName;
      }
    
      getListCourse() {
        return this.listCourse;
      }

}

module.exports = Department;