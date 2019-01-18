import React, { Component } from "react";
import { Paper, TextField, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { CREATE_POST } from "./PostCreate";
import { Mutation } from "react-apollo";
import { APP_SECRET, AUTH_TOKEN } from "../constants";
import jwt from "jsonwebtoken";

const styles = theme => ({
  root: {
    padding: "1rem",
    maxWidth: "800px",
    margin: "40px auto"
  },
  imageContainer: {
    marginTop: "20px",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    position: "relative"
  },
  image: {
    borderRadius: "5px"
  },
  imageClose: {
    position: "absolute",
    top: "2px",
    right: "2px"
  }
});

class PostCreateWithImage extends Component {
  state = {
    title: "sabit başlık",
    contentJson: "sabit içerik",
    picture: null
  };

  render() {
    const { classes } = this.props;
    const { picture, title, contentJson } = this.state;

    const authToken = localStorage.getItem(AUTH_TOKEN);
    const { userId } = authToken ? jwt.verify(authToken, APP_SECRET) : "";
    return (
      <Paper className={classes.root}>
        <div>
          <TextField
            type="file"
            onChange={({
              target: {
                files: [file]
              }
            }) => this.setState({ picture: file })}
            variant="outlined"
            fullWidth
            margin="normal"
          />
        </div>
        <div>
          <Mutation
            mutation={CREATE_POST}
            variables={{ title, contentJson, picture }}
            onCompleted={() => {
              this.props.history.push(`/user/${userId}`);
            }}
          >
            {postCreateWithPicture => (
              <div>
                <Button variant="contained" onClick={postCreateWithPicture}>
                  Server upload et
                </Button>
              </div>
            )}
          </Mutation>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(PostCreateWithImage);
