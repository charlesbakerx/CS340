// ./database/db-connector.js
require('dotenv').config({path: __dirname + '/config.env'})
const database_url = process.env.DATABASE_URL;
const database_name = process.env.DATABASE_NAME;
const database_user = process.env.DATABASE_USER;
const database_password = process.env.DATABASE_PASSWORD;
// Get an instance of mysql we can use in the app
var mysql = require('mysql')
const {configDotenv} = require("dotenv");

// Create a 'connection pool' using the provided credentials

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : database_url,
    user            : database_user,
    password        : database_password,
    database        : database_name
})

// Export it for use in our applicaiton
module.exports.pool = pool;
