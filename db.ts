const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Usama@12345",
  host: "localhost",
  port: 5432,
  database: "trellodb",
});

module.exports = pool;
