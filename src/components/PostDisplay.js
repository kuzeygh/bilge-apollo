import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Typography, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TextEditorDisplay from "./TextEditorDisplay";
import { Value } from "slate";

const TAKE_POST = gql`
  query TakePost($postId: ID!) {
    postById(postId: $postId) {
      id
      title
      content
      author {
        id
        name
        email
      }
    }
  }
`;

const styles = theme => ({
  root: {
    margin: "40px auto",
    maxWidth: "800px",
    padding: "1rem"
  },
  authorContainer: {
    display: "flex",
    justifyContent: "flex-end"
  }
});

class PostDisplay extends Component {
  render() {
    const postId = this.props.match.params.id;
    const { classes } = this.props;
    return (
      <Query query={TAKE_POST} variables={{ postId }}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error...</div>;

          const post = data.postById;
          let content = post.content;
          content = JSON.parse(content);
          content = Value.fromJSON(content);
          return (
            <Paper className={classes.root}>
              <Typography variant="h4">{post.title}</Typography>
              <TextEditorDisplay value={content} />
              <div className={classes.authorContainer}>
                <Typography variant="h5" color="secondary">
                  {post.author.email}
                </Typography>
              </div>
            </Paper>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(PostDisplay);
