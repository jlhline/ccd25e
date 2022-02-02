const Sequelize = require("sequelize");

const db = new Sequelize(
  "postgres://JohnHaberstroh@localhost:5432/messenger" ||
    "postgres://localhost:5432/messenger",
  {
    logging: false,
  }
);

module.exports = db;
