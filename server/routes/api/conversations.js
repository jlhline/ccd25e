const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId
        }
      },
      attributes: ["id", "lastSent", "notifications"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "ASC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId
            }
          },
          attributes: ["id", "username", "photoUrl"],
          required: false
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId
            }
          },
          attributes: ["id", "username", "photoUrl"],
          required: false
        }
      ]
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      convoJSON.latestMessageText =
        convoJSON.messages[convoJSON.messages.length - 1].text;
      // if current user sent the last message, they have read all messages from otherUser and should have 0 notifications
      if (convoJSON.lastSent !== convoJSON.otherUser.username) {
        convoJSON.notifications = 0;
      }
      // get the id of the last read message by other user 
      let lastReadIndex = convoJSON.messages.length - convoJSON.notifications - 1 
      while(lastReadIndex >= 0){
        if(convoJSON.messages[lastReadIndex].senderId !== convoJSON.otherUser.id) break;
        lastReadIndex--
      }
      convoJSON.avatarId = lastReadIndex >= 0 ? convoJSON.messages[lastReadIndex].id : null
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const { recipientId, senderId, lastSent, action } = req.body;

    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    //Update lastSent unless we are only resetting notifications to 0
    if (lastSent) await conversation.update({ lastSent: lastSent });
    //return immediately if no action specified
    if (!action) {
      return res.json({ lastSent });
    }
    //increment notifications by one
    else if (action === "inc") {
      await conversation.increment("notifications");
    }
    //reset notifications
    else if (action === "reset") {
      await conversation.set({ notifications: 0 });
    }
    await conversation.save();

    return res.json({ lastSent });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
