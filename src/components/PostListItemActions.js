import React, { Component } from "react";
import {
  IconButton,
  MenuList,
  MenuItem,
  Paper,
  Popper,
  Grow,
  ClickAwayListener
} from "@material-ui/core";
import { CreateTwoTone } from "@material-ui/icons";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { TAKE_USER } from "./UserDisplayQuery";
import { publishedPostData } from "../util.js";
import { Link } from "react-router-dom";

const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      id
      title
    }
  }
`;

const PUBLISH_POST = gql`
  mutation PublishPost($postId: ID!) {
    publishPost(postId: $postId) {
      id
      title
      published
    }
  }
`;

class PostListItemActions extends Component {
  state = {
    open: false
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    const { postId, actionFlag } = this.props;
    const { userId } = this.props.userLogin;
    return (
      <React.Fragment>
        <IconButton
          buttonRef={node => {
            this.anchorEl = node;
          }}
          aria-owns={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
        >
          <CreateTwoTone />
        </IconButton>
        <Popper
          open={open}
          anchorEl={this.anchorEl}
          transition
          disablePortal
          placement={"left"}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{
                transfromOrigin:
                  placement === "left" ? "left top" : "left bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    {actionFlag && (
                      <Mutation
                        mutation={PUBLISH_POST}
                        variables={{ postId }}
                        update={cache => {
                          const data = cache.readQuery({
                            query: TAKE_USER,
                            variables: { userId }
                          });

                          const publishedPosts = publishedPostData(
                            data,
                            postId
                          );

                          cache.writeQuery({
                            query: TAKE_USER,
                            publishedPosts
                          });
                        }}
                      >
                        {publishMutation => (
                          <MenuItem onClick={publishMutation}>Yayımla</MenuItem>
                        )}
                      </Mutation>
                    )}

                    <MenuItem component={Link} to={`/post/edit/${postId}`}>
                      Düzenle
                    </MenuItem>
                    <Mutation
                      mutation={DELETE_POST}
                      variables={{ postId }}
                      update={cache => {
                        const data = cache.readQuery({
                          query: TAKE_USER,
                          variables: { userId }
                        });

                        const deletedData = data.userPostsById.posts.filter(
                          post => post.id !== postId
                        );
                        data.userPostsById.posts = deletedData;
                        cache.writeQuery({
                          query: TAKE_USER,
                          data
                        });
                      }}
                    >
                      {deleteMutation => (
                        <MenuItem onClick={deleteMutation}>Sil</MenuItem>
                      )}
                    </Mutation>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </React.Fragment>
    );
  }
}

export default PostListItemActions;
