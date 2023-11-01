const db = require('../config/db.config');
const { 
    getKindOfRooms: getKindOfRoomsQuery
} = require('../database/queries');
const { logger } = require('../utils/logger');

class KindOfRoom {
    constructor(id,kind_of_room_name) {
        this.id = id;
        this.kind_of_room_name = kind_of_room_name;
    }

    static getKindOfRooms(cb) {
        db.query(getKindOfRoomsQuery, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, res);
        });
    }
}

module.exports = KindOfRoom;