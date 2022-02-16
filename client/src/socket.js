import io from "socket.io-client";
import store from "./store";
import {
  removeOfflineUser,
  addOnlineUser,
  setAvatar,
} from "./store/conversations";

import {
  handleIncomingMessage,
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
  const currentState = store.getState()

  if(currentState.user.id){
    const recipientId = data.recipientId;
    const currentState = store.getState()
    
    const userId = currentState.user.id
    const activeConversation = currentState.activeConversation;
    const doNotIncrement = activeConversation === data.senderName;

    if(userId === recipientId) store.dispatch(handleIncomingMessage(data, doNotIncrement));

  }
})

  //Passing along message information to pin the read-status avatar to newest message
  socket.on("read-status", async (data) => {

  const currentState = store.getState()
  const userId = currentState.user.id
  if(userId === data.recipientId) store.dispatch(setAvatar(data))
  });
});

export default socket;
