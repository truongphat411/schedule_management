const mysql = require('mysql');
const { logger } = require('../utils/logger');
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = require('../utils/secrets');
const util = require('util');

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});

function async_get_query(sql_query) {
    return util.promisify(connection.query).call(connection, sql_query);
} 

function async_push_query(sql_query, info) {
    return util.promisify(connection.query).call(connection, sql_query, info);
}

connection.connect((err) => {
    if (err) logger.error(err.message);
    else logger.info('Database connected')
});

module.exports = {
    connection,
    async_get_query,
    async_push_query
};