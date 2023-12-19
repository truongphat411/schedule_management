const db = require('../config/db.config');
const { 
    createNewRoom: createNewRoomQuery,
    findRoomById: findRoomByIdQuery,
    updateRoomById: updateRoomByIdQuery,
    deleteRoomById: deleteRoomByIdQuery,
    getRooms: getRoomsQuery,
    getAllRooms: getAllRoomsQuery
} = require('../database/queries');
const { logger } = require('../utils/logger');

class Room {
    constructor(id,room_name, capacity, area_id, kind_of_room_id) {
        this.id = id;
        this.room_name = room_name;
        this.capacity = capacity;
        this.area_id = area_id;
        this.kind_of_room_id = kind_of_room_id;
    }

    getRoomId() {
        return this.id;
    }

    getRoomName(){
        return this.room_name;
    }

    getSeatingCapacity(){
        return this.capacity;
    }

    getAreaId() {
        return this.area_id;
    }

    getKingOfRoomId() {
        return this.kind_of_room_id;
    }
   
    static create(newRoom, cb) {
        db.query(createNewRoomQuery, 
            [
                newRoom.room_name,
                newRoom.capacity,
                newRoom.area_id,
                newRoom.kind_of_room_id
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
                    area_id: newRoom.area_id,
                    kind_of_room_id: newRoom.kind_of_room_id
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
                    const room = res[0];
                    room.area = JSON.parse(room.area);
                    cb(null, room);
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

    static getRooms(cb) {
        db.query(getRoomsQuery, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                const roomsWithParsedJSON = res.map(room => {
                    return {
                        ...room,
                        area: JSON.parse(room.area)
                    };
                });
                cb(null, roomsWithParsedJSON);
        });
    }

    static readAll(cb) {
        db.query(getAllRoomsQuery, (err, res) => {
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

module.exports = Room;