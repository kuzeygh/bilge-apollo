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
import { TAKE_USER } from "./UserDisplay";

const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      id
      title
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
    const { postId } = this.props;
    const userId = this.props.user.id;
    return (
      <div>
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
          placement={"right"}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{
                transfromOrigin:
                  placement === "right" ? "right top" : "right bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    <MenuItem onClick={this.handleClose}>Düzenle</MenuItem>
                    <Mutation
                      mutation={DELETE_POST}
                      variables={{ postId }}
                      update={cache => {
                        const data = cache.readQuery({
                          query: TAKE_USER,
                          variables: { userId }
                        });

                        const deletedData = data.userById.posts.filter(
                          post => post.id !== postId
                        );
                        data.userById.posts = deletedData;
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
      </div>
    );
  }
}

export default PostListItemActions;
