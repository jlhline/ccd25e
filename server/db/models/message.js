const Sequelize = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  readStatuses: {
    type: Sequelize.JSONB,
    allowNull: false
  }
});
Message.updateStatuses = async function(conversationId, userId) {
  let messageToUpdate = Message.findOne({
    where: {
      conversationId: conversationId
    }
  });
  messageToUpdate.readStatuses[userId] = true;
  messageToUpdate.changed("readStatuses", true);
  await updateReadStatusForUser.save();
};

module.exports = Message;
