import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";
import { updateNotifications } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15,
  },
}));

const Sidebar = (props) => {
  const classes = useStyles();
  const conversations = props.conversations || [];
  const { handleChange, searchTerm, user } = props;

  const updateNotifs = async (body, otherUser, messageId) => {
    await props.updateNotifications(
      { ...body, recipientId: user.id },
      otherUser,
      messageId
    );
  };
  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {conversations
        .filter((conversation) =>
          conversation.otherUser.username.includes(searchTerm)
        )
        .map((conversation) => {
          return (
            <Chat
              updateNotifs={updateNotifs}
              conversation={conversation}
              key={conversation.otherUser.username}
            />
          );
        })}
    </Box>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateNotifications: (body, otherUser, messageId) => {
      dispatch(updateNotifications(body, otherUser, messageId));
    },
  };
};
const mapStateToProps = (state) => {
  return {
    conversations: state.conversations,
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
