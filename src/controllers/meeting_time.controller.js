const MeetingTime = require('../models/meeting_time.model');

exports.readAll = (req, res) => {

    MeetingTime.readAll((err, data) => {
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