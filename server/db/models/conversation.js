const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {});

// find conversation given array of chat members

Conversation.findConversation = async function(...chatMembers) {
  const conversation = await Conversation.findOne({
    where: {
      chatMembers: [...chatMembers]
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
