import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const styles = theme => ({
  mainContainer: {
    display: "flex",
    justifyContent: "center"
  },
  buttonContainer: {
    backgroundColor: "#37474f",
    display: "flex",
    justifyContent: "center",
    width: "70%",
    borderRadius: "0.5rem"
  },
  buttons: {
    margin: theme.spacing.unit * 2,
    padding: "1rem 0.5rem",
    width: "15%",
    "&:hover": {
      color: "white"
    }
  },
  notPublished: {
    backgroundColor: "#c8e6c9", // green - 100 ve 700
    color: "#388e3c"
  },
  published: {
    backgroundColor: "#bbdefb", // blue - 100 ve 700
    color: "#1976d2"
  }
});

const UserNavigationButtons = ({ classes, onClick }) => (
  <div className={classes.mainContainer}>
    <div className={classes.buttonContainer}>
      <Button
        className={[classes.buttons, classes.notPublished]}
        onClick={() => onClick({ type: "draft", draftFlag: true })}
      >
        TASLAKLAR
      </Button>
      <Button
        className={[classes.buttons, classes.published]}
        onClick={() => onClick({ type: "published", draftFlag: true })}
      >
        YAYINLAR
      </Button>
    </div>
  </div>
);

export default withStyles(styles)(UserNavigationButtons);
