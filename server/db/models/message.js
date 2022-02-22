const Sequelize = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  read: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});
Message.updateStatuses = async function(conversationId) {
  return Message.update(
    {
      read: true
    },
    {
      where: {
        conversationId: conversationId,
        read: false
      }
    }
  );
};

module.exports = Message;
