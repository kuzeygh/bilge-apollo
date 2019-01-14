import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    margin: "40px auto"
  }
});

class UserDisplay extends Component {
  render() {
    const { classes } = this.props;
    return <div className={classes.root}>User</div>;
  }
}

export default withStyles(styles)(UserDisplay);
