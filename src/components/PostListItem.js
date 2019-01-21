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

const PostListItem = props => (
  <div className={props.classes.root}>
    <div className={props.classes.titleContainer}>
      <ListItem button component={Link} to={`/post/${props.post.id}`}>
        <ListItemText primary={props.post.title} />
      </ListItem>
    </div>
    <div className={props.classes.buttonContainer}>
      <PostListItemActions postId={props.post.id} userLogin={props.userLogin} />
    </div>
  </div>
);

export default withStyles(styles)(PostListItem);
