const db  = require('../config/db.config');
const { createNewAccount: createNewAccountQuery, findAccountByUserName: findAccountByUserNameQuery} = require('../database/queries');
const { logger } = require('../utils/logger');

class Account {
    constructor(id, full_name,type_id,user_name, email, password,create_on) {
        this.id = id;
        this.full_name = full_name;
        this.type_id = type_id;
        this.user_name = user_name;
        this.email = email;
        this.password = password;
        this.create_on = create_on;
    }

    static create(newAccount, cb) {
        db.query(createNewAccountQuery, 
            [
                newAccount.type_id,
                newAccount.email,
                newAccount.password,
                newAccount.full_name, 
                newAccount.user_name, 
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    full_name: newAccount.full_name,
                    type_id: newAccount.type_id,
                    user_name: newAccount.user_name,
                    email: newAccount.email,
                });
        });
    }

    static findByUserName(user_name, cb) {
        db.query(findAccountByUserNameQuery, user_name, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.length) {
                const accountWithParsedJSON = res.map(account => {
                    return {
                        ...account,
                        type: JSON.parse(account.type)
                    };
                }); 
                cb(null, accountWithParsedJSON);
                return;
            }
            cb({ kind: "not_found" }, null);
        })
    }
}

module.exports = Account;