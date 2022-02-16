import React from "react";
import { Box, Typography } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";

import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
  typo: {
    display: "flex",
    backgroundColor: `${theme.palette.primary.main}`,
    color: "white",
    minWidth: "24px",

    justifyContent: "center",
    borderRadius: "10px",
  },
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation, setNotifsToZero, setActiveChat } = props;
  const { otherUser } = conversation;
  const { notifications } = conversation;
  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser.username);
    if (notifications > 0 && conversation.messages.length)
      await setNotifsToZero(
        {
          senderId: otherUser.id,
          messageId: conversation.messages[conversation.messages.length - 1].id,
          conversationId: conversation.id,
        },
        conversation.otherUser.username
      );
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      <Typography className={classes.typo}>
        {notifications === 0 ? null : notifications}
      </Typography>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
  };
};

export default connect(null, mapDispatchToProps)(Chat);
