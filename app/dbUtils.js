// const mysql = require("mysql");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_NAME || "sql_db",
    'supportBigNumbers': true,
  });
  console.log("Connected to MySQL Server!");
  return connection;
}

module.exports = { getConnection };
