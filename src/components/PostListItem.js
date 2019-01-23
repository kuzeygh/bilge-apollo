import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import PostListItemActions from "./PostListItemActions";

const styles = theme => ({
  root: {
    display: "flex",
    margin: "20px"
  },
  titleContainer: {
    width: "75%"
  },
  buttonContainer: {
    width: "25%",
    display: "flex",
    justifyContent: "flex-end"
  }
});

const PostListItem = ({ post, userLogin, classes, actionFlag }) => (
  <div className={classes.root}>
    <div className={classes.titleContainer}>
      <ListItem button component={Link} to={`/post/${post.id}`}>
        <ListItemText primary={post.title} />
      </ListItem>
    </div>
    <div className={classes.buttonContainer}>
      <PostListItemActions
        postId={post.id}
        userLogin={userLogin}
        actionFlag={actionFlag}
      />
    </div>
  </div>
);

export default withStyles(styles)(PostListItem);
