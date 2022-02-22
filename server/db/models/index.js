const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");

// associations

Conversation.belongsToMany(User, {
  through: "groupChats",
  as: "chatMembers"
});
User.belongsToMany(Conversation, {
  through: "groupChats",
  as: "conversations"
});
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message
};
