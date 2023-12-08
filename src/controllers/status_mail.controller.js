const StatusMail = require('../models/status_mail.model');

exports.readAll = (req, res) => {

    StatusMail.read((err, data) => {
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