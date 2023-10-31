const Room = require('../models/room.model');

exports.create = (req, res) => {
    const {room_name, seating_capacity} = req.body;

    const room = new Room(room_name, seating_capacity);

    Room.create(room, (err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
        } else {    
            res.status(201).send({
                status: "success",
                data: {
                    data
                }
            });
        }
    })
}

exports.read = (req, res) => {
    const roomId = req.params.roomId;

    Room.read(roomId, (err, data) => {
        if(err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Room was not found`
                });
                return;
            }
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        if(data){
            res.status(200).send({
                status: 'success',
                data: {
                    room_name: data.room_name,
                    seating_capacity: data.seating_capacity,
                }
            });
            return;
        }
    })
}

exports.update = (req, res) => {
    const {room_name, seating_capacity} = req.body;

    const room = new Room(room_name, seating_capacity);

    Room.update(room, (err, data) => {
        if(err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Room not found`
                });
                return;
            }
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        if (data) {
            res.status(200).send({
                status: 'success',
                message: 'Room updated successfully'
            });
            return;
        }
    })
}

exports.delete = (req, res) => {
    const roomId = req.params.roomId;

    Room.delete(courseId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Room not found`
                });
                return;
            }
            res.status(500).send({
                status: 'error',
                message: err.message
            });
        } else {
            res.status(200).send({
                status: 'success',
                message: 'Room deleted successfully'
            });
        }
    })
}

exports.readAll = (req, res) => {

    Room.getRooms((err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
        } else {    
            res.status(201).send({
                status: "success",
                data: {
                    data
                }
            });
        }
    })
}