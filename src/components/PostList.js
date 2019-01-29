import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

const POST_LIST = gql`
  query PostList {
    postList {
      id
      title
      content
      published
      votes {
        id
      }
      author {
        id
        name
      }
    }
  }
`;

const styles = theme => ({
  postContainer: {
    width: "50%",
    height: "50%",
    margin: "2rem auto",
    backgroundColor: "#fff",
    borderRadius: "0.5rem",
    cursor: "pointer"
  }
});

class PostList extends Component {
  handleOnClick = postId => {
    this.props.history.push(`/post/${postId}`);
  };

  render() {
    const { classes } = this.props;
    return (
      <Query query={POST_LIST}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error...</div>;

          const { postList } = data;
          return (
            <React.Fragment>
              {postList.map(post => (
                <div
                  key={post.id}
                  className={classes.postContainer}
                  onClick={() => this.handleOnClick(post.id)}
                >
                  {post.title}
                </div>
              ))}
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(withRouter(PostList));
