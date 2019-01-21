import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Button, Typography, TextField, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TextEditor from "./TextEditor";
import TextEditorQuery from "./TextEditorQuery";
import { Value } from "slate";
import { AUTH_TOKEN, APP_SECRET, initialValue } from "../constants";
import jwt from "jsonwebtoken";

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
  state = {
    title: "Yükleniyor",
    content: initialValue,
    firstQuery: false,
    created: false
  };

  handleTextEditor = ({ value }) => {
    this.setState({
      content: value
    });
  };

  afterQuery(data) {
    let content = data.postById.content;
    const post = data.postById;
    const { title } = post;
    content = JSON.parse(content);
    content = Value.fromJSON(content);
    this.setState({ content, title, firstQuery: true });
  }

  render() {
    const { classes } = this.props;

    const authToken = localStorage.getItem(AUTH_TOKEN);
    const { userId } = authToken ? jwt.verify(authToken, APP_SECRET) : "";

    const postId = this.props.match.params.id;
    const { title, firstQuery } = this.state;
    let { content } = this.state;
    const contentJson = JSON.stringify(content);

    return (
      <Paper className={classes.root}>
        {!firstQuery && (
          <TextEditorQuery
            postId={postId}
            onCompleted={data => this.afterQuery(data)}
          />
        )}

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
            value={this.state.content}
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

export default withStyles(styles)(PostEdit);
