import React, { Component } from "react";
import { Typography, Grow } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TextEditor from "./TextEditor";
import { Value } from "slate";
import PostUserActions from "./PostUserActions";

const styles = theme => ({
  root: {
    maxWidth: "1400px",
    margin: "auto",
    padding: "1rem",
    backgroundColor: "white",
    borderRadius: "0.50rem"
  },
  flexContainer: {
    display: "flex",
    justifyContent: "center"
  },
  titleContainer: {
    padding: "1rem",
    width: "75%",
    borderRadius: "0.5rem",
    backgroundColor: "#1a237e"
  },
  title: {
    color: "#fafafa",
    textAlign: "center",
    fontSize: "2vmax"
  },
  authorContainer: {
    display: "flex",
    justifyContent: "flex-end"
  },
  userActions: {
    margin: "3rem auto"
  }
});

class PostDisplay extends Component {
  render() {
    const { classes, post } = this.props;

    let content = post.content;
    content = JSON.parse(content);
    content = Value.fromJSON(content);

    return (
      <Grow in>
        <div className={classes.root}>
          <div className={classes.flexContainer}>
            <div className={classes.titleContainer}>
              <Typography variant="h4" className={classes.title}>
                {post.title}
              </Typography>
            </div>
          </div>
          <TextEditor value={content} readOnly={true} display />
          <div className={classes.authorContainer}>
            <Typography variant="body1" color="secondary">
              "Kullanıcı Email"
            </Typography>
          </div>
          <div className={classes.userActions}>
            <PostUserActions />
          </div>
        </div>
      </Grow>
    );
  }
}

export default withStyles(styles)(PostDisplay);
