const db = require('../config/db.config');
const { 
    createNewRoom: createNewRoomQuery,
    findRoomById: findRoomByIdQuery,
    updateRoomById: updateRoomByIdQuery,
    deleteRoomById: deleteRoomByIdQuery
} = require('../database/queries');
const { logger } = require('../utils/logger');

class Room {
    constructor(id,room_name, capacity) {
        this.id = id;
        this.room_name = room_name;
        this.capacity = capacity;
    }

    getRoomId() {
        return this.id;
    }

    getRoomName(){
        return this.room_name;
    }

    getCapacity(){
        return this.capacity;
    }
   
    static create(newRoom, cb) {
        db.query(createNewRoomQuery, 
            [
                newRoom.room_name,
                newRoom.capacity
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    room_name: newRoom.room_name,
                    capacity: newRoom.capacity,
                });
        });
    }

    static read(roomId, cb) {
        db.query(findRoomByIdQuery, roomId, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                if (res.length) {
                    cb(null, res[0]);
                    return;
                }
                cb({ kind: "not_found" }, null);
        });
    }

    static update(room, cb) {
        db.query(updateRoomByIdQuery, 
        [   
            room.room_name,
            room.capacity
        ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    room_name: room.room_name,
                    capacity: room.capacity
                });
        });
    }

    static delete(roomId, cb) {
        db.query(deleteRoomByIdQuery, roomId, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {message: 'Room deleted successfully'})
        });
    }
}

module.exports = Room;