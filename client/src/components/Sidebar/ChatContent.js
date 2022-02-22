import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  preview: {
    fontSize: 12,
    letterSpacing: -0.17,
    fontWeight: (props) => props.fontWeight,
    color: (props) => props.color,
  },
});

const ChatContent = (props) => {
  const { conversation } = props;
  const { latestMessageText, otherUser, notifications } = conversation;
  const previewProps = {
    fontWeight: notifications ? "regular" : "bold",
    color: notifications ? "black" : "#9CADC8",
  };
  const classes = useStyles(previewProps);

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.preview}>{latestMessageText}</Typography>
      </Box>
    </Box>
  );
};

export default ChatContent;
