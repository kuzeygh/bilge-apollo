import React, { Component } from "react";
import { Paper, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

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
    file: null
  };

  closeImage = () => {
    this.setState({ file: null });
  };

  render() {
    const { classes } = this.props;
    const { file } = this.state;
    return (
      <Paper className={classes.root}>
        <TextField
          type="file"
          onChange={event =>
            this.setState({ file: URL.createObjectURL(event.target.files[0]) })
          }
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <div className={classes.imageContainer}>
          {file && (
            <img
              src={file}
              style={{ width: "400px", height: "400px" }}
              alt="ön izleme"
              className={classes.image}
            />
          )}
          {file && (
            <button className={classes.imageClose} onClick={this.closeImage}>
              X
            </button>
          )}
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(PostCreateWithImage);
