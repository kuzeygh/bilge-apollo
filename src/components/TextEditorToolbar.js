import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Toolbar, Icon, Fab } from "@material-ui/core";
import classNames from "classnames";

const styles = theme => ({
  container: {
    display: "flex",
    justifyContent: "center"
  },
  icon: {
    margin: theme.spacing.unit * 2
  }
});

const TextEditorToolbar = ({ onClick, onClickLink, onClickImage, classes }) => (
  <Toolbar className={classes.container}>
    <Fab
      onClick={event => onClick(event, { type: "bold" })}
      size="medium"
      className={classes.icon}
    >
      <Icon className={classNames("fas fa-bold")} />
    </Fab>

    <Fab
      onClick={event => onClick(event, { type: "italic" })}
      size="medium"
      className={classes.icon}
    >
      <Icon className={classNames("fas fa-italic")} />
    </Fab>

    <Fab
      onClick={event => onClick(event, { type: "strikethrough" })}
      size="medium"
      className={classes.icon}
    >
      <Icon className={classNames("fas fa-strikethrough")} />
    </Fab>

    <Fab
      onClick={event => onClick(event, { type: "underline" })}
      size="medium"
      className={classes.icon}
    >
      <Icon className={classNames("fas fa-underline")} />
    </Fab>

    <Fab
      size="medium"
      className={classes.icon}
      onMouseDown={event => onClickLink(event)}
    >
      <Icon className={classNames("fas fa-link")} />
    </Fab>

    <Fab
      size="medium"
      className={classes.icon}
      onMouseDown={event => onClickImage(event)}
    >
      <Icon className={classNames("fas fa-images")} />
    </Fab>
  </Toolbar>
);

export default withStyles(styles)(TextEditorToolbar);
