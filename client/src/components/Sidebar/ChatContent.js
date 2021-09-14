import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
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
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  previewTextUnread: {
    fontSize: 12,
    color: "#000000",
    letterSpacing: -0.17,
  },
  notification: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    padding: theme.spacing(1.8),
    borderRadius: 100,
    fontSize: 11,
    fontWeight: "bold",
    backgroundColor: "#3f92ff",
    color: "#FFFFFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser, unreadMessageCount } = conversation;

  const numberFormatter = Intl.NumberFormat("en", { notation: "compact" });

  const unread = unreadMessageCount > 0;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={unread ? classes.previewTextUnread: classes.previewText}
        >
          {latestMessageText}
        </Typography>
      </Box>
      {unread? (
        <Box>
          <Typography className={classes.notification}>
            {numberFormatter.format(unreadMessageCount)}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

export default ChatContent;
