const GroupStudents = require('../models/group_students.model');

exports.readAll = (req, res) => {

    GroupStudents.readAll((err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
        } else {    
            res.status(200).send({
                status: "success",
                data
            });
        }
    })
}