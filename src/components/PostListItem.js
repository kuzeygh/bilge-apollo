import React from "react";
import {
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const styles = theme => ({
  root: {
    display: "flex"
  },
  titleContainer: {
    width: "75%"
  },
  buttonContainer: {
    width: "25%"
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
      <ListItem alignItems="center">
        <ListItemSecondaryAction>
          <IconButton>
            <Delete />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  </div>
);

export default withStyles(styles)(PostListItem);
