const Sequelize = require("sequelize");
//Change made: adding my username to connection uri(no password)
const db = new Sequelize(
  process.env.DATABASE_URL ||
    `postgres://${process.env.DATABASE_USER}@localhost:5432/messenger`,
  {
    logging: false,
  }
);

module.exports = db;
