const db = require('../config/db.config');
const { createNewUser: createNewUserQuery, findUserByUserName: findUserByUserNameQuery , findUserById: findUserByIdQuery} = require('../database/queries');
const { logger } = require('../utils/logger');

class User {
    constructor(firstname, lastname, username, password) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.password = password;
    }

    static create(newUser, cb) {
        db.query(createNewUserQuery, 
            [
                newUser.firstname, 
                newUser.lastname, 
                newUser.username, 
                newUser.password
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    username: newUser.username
                });
        });
    }

    static findByUserName(username, cb) {
        db.query(findUserByUserNameQuery, username, (err, res) => {
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
        })
    }
}

module.exports = User;