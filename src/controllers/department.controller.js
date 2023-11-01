const Department = require('../models/department.model');

exports.readAll = (req, res) => {

    Department.getDepartments((err, data) => {
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