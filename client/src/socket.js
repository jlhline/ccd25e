import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  incrementNotifications,
} from "./store/conversations";

import {
  updateNotifications,
} from "./store/utils/thunkCreators";

const socket = io(window.location.origin);

socket.on("connect", () => {
  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", async (data) => {
  
    const recipientId = data.recipientId;
    const currentState = store.getState()
    const userId = currentState.user.id
    const activeConversation = currentState.activeConversation;
    
    if(userId === recipientId) store.dispatch(setNewMessage(data.message, data.sender));
    if(activeConversation !== data.senderName) {
      store.dispatch(incrementNotifications(data.senderName))
      store.dispatch(updateNotifications({ lastSent: data.senderName, senderId: data.message.senderId, recipientId: recipientId, action : 'inc'},data.senderName))
    } else {
      store.dispatch(updateNotifications({ lastSent: data.senderName, senderId: data.message.senderId, recipientId: recipientId},data.senderName))
    }
  });
});

export default socket;
