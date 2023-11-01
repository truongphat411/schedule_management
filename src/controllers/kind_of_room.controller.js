const KindOfRoom = require('../models/kind_of_room.model');

exports.readAll = (req, res) => {

    KindOfRoom.getKindOfRooms((err, data) => {
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