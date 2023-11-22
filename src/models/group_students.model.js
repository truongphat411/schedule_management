class GroupStudents {
    constructor(id, group_name, numberOfStudents, department_id) {
        this.id = id;
        this.group_name = group_name;
        this.numberOfStudents = numberOfStudents;
        this.department_id = department_id;
    }

    getId() {
        return this.id;
      }
    
    getGroupName() {
        return this.group_name;
    }

    getNumberOfStudents() {
        return this.numberOfStudents;
    }

    getDepartmentId() {
        return this.department_id;
    }
    
}

module.exports = GroupStudents;