import React, { Component } from "react";
import { Paper, TextField, Typography, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import TextEditor from "./TextEditor";
import { initialValue } from "../constants";
import { TAKE_USER } from "./UserDisplay";
import { AUTH_TOKEN, APP_SECRET } from "../constants";
import jwt from "jsonwebtoken";

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $contentJson: String!) {
    createPost(title: $title, content: $contentJson) {
      id
      title
      content
      published
    }
  }
`;

const styles = theme => ({
  rootContainer: {
    maxWidth: "800px",
    margin: "40px auto"
  },
  root: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 2
  },
  titleContainer: {
    margin: "20px"
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

class PostCreate extends Component {
  state = {
    title: "",
    content: initialValue,
    created: false
  };

  handleTextEditor = ({ value }) => {
    this.setState({ content: value });
  };

  render() {
    const { classes } = this.props;
    const { title, created } = this.state;
    let { content } = this.state;
    let contentJson = JSON.stringify(content);

    const authToken = localStorage.getItem(AUTH_TOKEN);
    const { userId } = authToken ? jwt.verify(authToken, APP_SECRET) : "";

    return (
      <div className={classes.rootContainer}>
        <Paper elevetion={24} className={classes.root}>
          <div>
            <Typography variant="h5" color="primary">
              Başlık ve içeriklerini doldurun
            </Typography>
            <div className={classes.titleContainer}>
              <TextField
                placeholder="Başlık"
                label="Başlık"
                margin="normal"
                id="title"
                fullWidth
                value={title}
                onChange={event => this.setState({ title: event.target.value })}
              />
            </div>

            <div className={classes.contentContainer}>
              <TextEditor
                onChange={this.handleTextEditor}
                value={content}
                placeholder="İçerik"
              />
            </div>
          </div>
          <div className={classes.buttonContainer}>
            <Mutation
              mutation={CREATE_POST}
              variables={{ title, contentJson }}
              update={(cache, { data: { createPost } }) => {
                const data = cache.readQuery({
                  query: TAKE_USER,
                  variables: { userId }
                });
                data.userById.posts.unshift(createPost);

                cache.writeQuery({
                  query: TAKE_USER,
                  data
                });
              }}
              onCompleted={() => {
                this.setState({ created: true });
                this.props.history.push(`/user/${userId}`);
              }}
            >
              {createPostMutation =>
                created ? (
                  <Button
                    variant="contained"
                    color="default"
                    className={classes.buttons}
                    disabled
                    onClick={createPostMutation}
                  >
                    Kaydet
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    className={classes.buttons}
                    onClick={createPostMutation}
                    color="primary"
                  >
                    Kaydet
                  </Button>
                )
              }
            </Mutation>
            {created ? (
              <Button
                variant="contained"
                color="primary"
                className={classes.buttons}
              >
                Yayımla
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className={classes.buttons}
                disabled
              >
                Yayımla
              </Button>
            )}
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(PostCreate);
