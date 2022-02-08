const { Op, Sequelize } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  lastSent: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
    get(){
      return this.getDataValue("lastSent");
    },
    set(value){
      this.setDataValue("lastSent",value);
    },
  },
  notifications: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    set(value){
      this.setDataValue("notifications",value);
    },
    get(){
      return this.getDataValue("notifications");
    },
  }
});

// find conversation given two user Ids

Conversation.findConversation = async function(user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
