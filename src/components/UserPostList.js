import React from "react";
import { Slide, List } from "@material-ui/core";
import PostListItem from "./PostListItem";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  container: {
    width: "100%",
    backgroundColor: "white",
    padding: "2rem",
    marginTop: "3rem",
    borderRadius: "0.5rem"
  }
});

const UserPostList = ({
  draftFlag,
  notPublishedPosts,
  userLogin,
  publishedPosts,
  classes
}) => {
  const dataList = notPublishedPosts || publishedPosts;

  return (
    <Slide direction="right" in={draftFlag} mountOnEnter unmountOnExit>
      <div className={classes.container}>
        <List>
          {dataList.map(post => (
            <PostListItem post={post} key={post.id} userLogin={userLogin} />
          ))}
        </List>
      </div>
    </Slide>
  );
};

export default withStyles(styles)(UserPostList);
