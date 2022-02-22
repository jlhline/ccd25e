export const addMessageToStore = (state, payload) => {
  const { message, sender, increment } = payload;

  const notification = increment ? 1 : 0;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      notifications: notification,
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      return {
        ...convo,
        messages: [...convo.messages, message],
        latestMessageText: message.text,
        notifications: convo.notifications + notification,
      };
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      return {
        ...convo,
        id: message.conversationId,
        messages: [...convo.messages, message],
        latestMessageText: message.text,
        notifications: 0,
      };
    } else {
      return convo;
    }
  });
};

export const reset = (state, otherUsername) => {
  return state.map((convo) => {
    if (convo.otherUser.username === otherUsername) {
      return {
        ...convo,
        notifications: 0,
      };
    } else {
      return convo;
    }
  });
};

export const setReadStatus = (state, messageData) => {
  return state.map((convo) => {
    if (convo.otherUser.id === messageData.senderId) {
      return {
        ...convo,
        avatarId: messageData.messageId,
      };
    } else {
      return convo;
    }
  });
};
