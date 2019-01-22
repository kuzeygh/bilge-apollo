import React, { Component } from "react";
import { Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { Button, Typography, TextField, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TextEditor from "./TextEditor";
import { Value } from "slate";
import { _TAKE_USER_ID } from "./MainLayout";

const UPDATE_POST = gql`
  mutation UpdatePost($postId: ID!, $title: String!, $contentJson: String!) {
    updatePost(postId: $postId, title: $title, content: $contentJson) {
      id
      title
      content
      published
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
  },

  titleContainer: {
    display: "flex",
    justifyContent: "center"
  },
  contentContainer: {
    padding: "20px",
    borderTop: "1px solid #ccc"
  },
  buttons: {
    margin: theme.spacing.unit
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center"
  }
});

class PostEdit extends Component {
  componentDidMount() {
    const { userLogin } = this.props.client.readQuery({
      query: _TAKE_USER_ID
    });
    this.setState({ userId: userLogin.userId });
  }

  state = {
    title: this.props.post.title,
    content: this.props.post.content,
    created: false,
    userId: null
  };

  render() {
    console.log(this.props);
    const { classes, post } = this.props;
    const postId = post.id;

    const { title, userId } = this.state;
    let { content } = this.state;
    const contentJson = JSON.stringify(content);

    if (typeof content === "string") {
      content = JSON.parse(content);
      content = Value.fromJSON(content);
    }

    return (
      <Paper className={classes.root}>
        <div>
          <Typography
            variant="h5"
            color="primary"
            className={classes.titleContainer}
          >
            Başlık ve içeriklerini doldurun
          </Typography>
        </div>
        <div>
          <TextField
            placeholder="Başlık"
            label="Başlık"
            margin="normal"
            id="title"
            fullWidth
            value={this.state.title}
            onChange={event => this.setState({ title: event.target.value })}
            autoFocus
          />
        </div>

        <div className={classes.contentContainer}>
          <TextEditor
            onChange={({ value }) => this.setState({ content: value })}
            value={content}
          />
        </div>
        <div className={classes.buttonContainer}>
          <Mutation
            mutation={UPDATE_POST}
            variables={{ postId, title, contentJson }}
            onCompleted={() => {
              this.props.history.push(`/user/${userId}`);
            }}
          >
            {updatePostMutation => (
              <Button
                variant="contained"
                color="default"
                className={classes.buttons}
                onClick={updatePostMutation}
              >
                Güncelle
              </Button>
            )}
          </Mutation>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(withApollo(PostEdit));
