const db = require('../config/db.config');
const { 
    getSemesters: getSemestersQuery,
} = require('../database/queries');

class Semester {
    constructor(id,semester_name) {
        this.id = id;
        this.semester_name = semester_name;
    }

    static readAll(cb) {
        db.query(getSemestersQuery, (err, res) => {
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

module.exports = Semester;