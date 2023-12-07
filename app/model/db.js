const { Pool } = require('pg');
const dbConfig = require('../config/db-config');
const connection = new Pool({
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    host : dbConfig.HOST,
    port: dbConfig.PORT
})
connection.connect();
module.exports = connection;