import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  incrementNotifications,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    console.log("data inside new message emit",data)
    const recipientId = data.recipientId;
    const currentState = store.getState()
    const userId = currentState.user.id
    const activeConversation = currentState.activeConversation;
    console.log(userId,recipientId,activeConversation,data.senderName)
    if(userId === recipientId) store.dispatch(setNewMessage(data.message, data.sender));
    if(activeConversation !== data.senderName) store.dispatch(incrementNotifications(data.senderName))
  });
});

export default socket;
