import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  incrementNotifications,
  setAvatar,
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
  const currentState = store.getState()

  if(currentState.user.id){
    const recipientId = data.recipientId;
    const currentState = store.getState()
    
    const userId = currentState.user.id
    const activeConversation = currentState.activeConversation;
    
    if(userId === recipientId) store.dispatch(setNewMessage(data.message, data.sender));

    //Update notifications number in DB and increment notifications on front end without emitting read status
    if(activeConversation !== data.senderName) {
      
      store.dispatch(incrementNotifications(data.senderName))
      store.dispatch(updateNotifications({ lastSent: data.senderName, senderId: data.message.senderId, recipientId: recipientId, action : 'inc'},data.senderName,null))
    } 
    //Update DB lastSent property and automatically emit read status for the active conversation
    else {
      
      store.dispatch(updateNotifications({ lastSent: data.senderName, senderId: data.message.senderId, recipientId: recipientId},data.senderName,data.message.id))
    }
  }
    
  });

  //Passing along message information to pin the read-status avatar to newest message
  socket.on("read-status", async (data) => {
   
  const currentState = store.getState()
  const userId = currentState.user.id
  if(userId === data.recipientId) store.dispatch(setAvatar(data))
  });
});

export default socket;
