const db  = require('../config/db.config');
const { createNewAccount: createNewAccountQuery,
     findAccountByUserName: findAccountByUserNameQuery,
     getAllAccount: getAllAccountQuery,
    findAccountById: findAccountByIdQuery,
    getAccountType: getAccountTypeQuery
    } = require('../database/queries');
const { logger } = require('../utils/logger');

class Account {
    constructor(id, full_name,type_id,user_name, email, password,department_id) {
        this.id = id;
        this.full_name = full_name;
        this.type_id = type_id;
        this.user_name = user_name;
        this.email = email;
        this.password = password;
        this.department_id = department_id;
    }

    static create(newAccount, cb) {
        db.query(createNewAccountQuery, 
            [
                newAccount.full_name, 
                newAccount.user_name, 
                newAccount.email,
                newAccount.type_id,
                newAccount.password,
                newAccount.department_id
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

    static findById(account_id, cb) {
        db.query(findAccountByIdQuery, account_id, (err, res) => {
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
                let account = accountWithParsedJSON[0];
                cb(null, account);
                return;
            }
            cb({ kind: "not_found" }, null);
        })
    }

    static readAll(cb) {
        db.query(getAllAccountQuery, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                if (res.length) {
                    const accountsWithParsedJSON = res.map(account => {
                        return {
                            ...account,
                            type: JSON.parse(account.type),
                        };
                    });
                    cb(null, accountsWithParsedJSON);
                    return;
                }
        });
    }

    static readAllAccountType(cb) {
        db.query(getAccountTypeQuery, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                if (res.length) {
                    cb(null, res);
                    return;
                }
        });
    }
}

module.exports = Account;