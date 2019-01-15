import React, { Component } from "react";
import { Paper, TextField, Typography, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
      author {
        id
      }
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
  buttons: {
    margin: theme.spacing.unit
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center"
  }
});

class MainRouter extends Component {
  state = {
    title: "",
    content: "",
    created: false
  };

  render() {
    const { classes } = this.props;
    const { title, content, created } = this.state;

    return (
      <div className={classes.rootContainer}>
        <Paper elevetion={24} className={classes.root}>
          <div>
            <Typography variant="h5" color="primary">
              Başlık ve içeriklerini doldurun
            </Typography>
            <TextField
              placeholder="Başlık"
              label="Başlık"
              margin="normal"
              id="title"
              fullWidth
              value={title}
              onChange={event => this.setState({ title: event.target.value })}
            />

            <TextField
              placeholder="İçerik"
              label="İçerik"
              margin="normal"
              id="title"
              value={content}
              onChange={event => this.setState({ content: event.target.value })}
              fullWidth
              multiline
              rows={10}
            />
          </div>
          <div className={classes.buttonContainer}>
            <Mutation
              mutation={CREATE_POST}
              variables={{ title, content }}
              onCompleted={data => {
                this.setState({ created: true });
                const userId = data.createPost.author.id;
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

export default withStyles(styles)(MainRouter);
