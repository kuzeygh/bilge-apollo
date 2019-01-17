import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Typography, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TextEditorDisplay from "./TextEditorDisplay";
import TextEditor from "./TextEditor";
import { Value } from "slate";
import { initialValue } from "../constants";

const TAKE_POST = gql`
  query TakePost($postId: ID!) {
    postById(postId: $postId) {
      id
      title
      content
      published
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

class PostEdit extends Component {
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

    const authToken = localStorage.getItem(AUTH_TOKEN);
    const { userId } = authToken ? jwt.verify(authToken, APP_SECRET) : "";

    const postId = this.props.match.params.id;
    const { classes } = this.props;

    return (
      <Query query={TAKE_POST} variables={{ postId }}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error...</div>;

          const post = data.postById;
          let title = post.title;
          let content = post.content;
          content = JSON.parse(content);
          content = Value.fromJSON(content);
          return (
            <Paper className={classes.root}>
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
                        onChange={event =>
                          this.setState({ title: event.target.value })
                        }
                      />
                    </div>

                    <div className={classes.contentContainer}>
                      <TextEditor
                        onChange={this.handleTextEditor}
                        value={content}
                        placeholder="İçerik"
                        readOnly={false}
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
                      {createPostMutation => (
                        <Button
                          variant="contained"
                          color="default"
                          className={classes.buttons}
                          disabled
                          onClick={createPostMutation}
                        >
                          Güncelle
                        </Button>
                      )}
                    </Mutation>
                  </div>
                </Paper>
              </div>
            </Paper>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(PostEdit);
