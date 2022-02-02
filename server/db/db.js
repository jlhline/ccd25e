const Sequelize = require("sequelize");
//Change made: adding my username to connection uri(no password)
const db = new Sequelize(
  "postgres://JohnHaberstroh@localhost:5432/messenger" ||
    "postgres://localhost:5432/messenger",
  {
    logging: false,
  }
);

module.exports = db;
