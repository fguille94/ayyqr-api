var mysql = require('mysql');

var connection = mysql.createConnection({
  host            : process.env.DB_HOST,
  port            : process.env.DB_PORT,
  user            : process.env.DB_USER,
  password        : process.env.DB_PWD,
  database        : process.env.DB_NAME
});

let db = mysql.createPool({
  connectionLimit : process.env.DB_LIMIT,
  host            : process.env.DB_HOST,
  port            : process.env.DB_PORT,
  user            : process.env.DB_USER,
  password        : process.env.DB_PWD,
  database        : process.env.DB_NAME
});

// module.exports = connection;
module.exports = db;