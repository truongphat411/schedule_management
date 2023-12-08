const db = require('../config/db.config');
const { 
    getStatusMail: getStatusMailQuery,
} = require('../database/queries');

class StatusMail {
    constructor(id,message,semester_id,instructor_id) {
        this.id = id;
        this.message = message;
        this.semester_id = semester_id;
        this.instructor_id = instructor_id;
    }

    static read(cb) {
        db.query(getStatusMailQuery, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                if(res.length === 0){
                    cb(null, []);
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

module.exports = StatusMail;