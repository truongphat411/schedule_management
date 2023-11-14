const db = require('../config/db.config');

class Semester {
    constructor(id,semester_name) {
        this.id = id;
        this.semester_name = semester_name;
    }
}

module.exports = Semester;