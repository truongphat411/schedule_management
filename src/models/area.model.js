const db = require('../config/db.config');
const { 
    getAreas: getAreasQuery
} = require('../database/queries');
const { logger } = require('../utils/logger');

class Area {
    constructor(id,area_name) {
        this.id = id;
        this.area_name = area_name;
    }

    static getAreas(cb) {
        db.query(getAreasQuery, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, res);
        });
    }
}

module.exports = Area;