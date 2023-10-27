const db = require('../config/db.config');

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

}

module.exports = Department;