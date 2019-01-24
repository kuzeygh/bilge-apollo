import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Toolbar, Icon, Fab } from "@material-ui/core";
import classNames from "classnames";

const styles = theme => ({
  container: {
    display: "flex",
    justifyContent: "center"
  },
  icon: {
    margin: theme.spacing.unit * 2,
    backgroundColor: "#009688",
    color: "white"
  },
  iconActive: {
    margin: theme.spacing.unit * 2,
    backgroundColor: "white",
    color: "#009688"
  }
});

class TextEditorToolbar extends Component {
  state = {
    iconActive: []
  };

  handleOnClick = (event, type) => {
    event.preventDefault();
    let { iconActive } = this.state;
    if (type === "link") {
      this.props.onClickLink(event);
    } else if (type === "image") {
      this.props.onClickImage(event);
    } else {
      this.props.onClick(event, { type });
    }

    this.setState(() => {
      if (iconActive.length === 0) {
        iconActive.push(type);
      } else {
        let firstHalf, lastHalf;
        for (let i = 0; i < iconActive.length; i++) {
          if (iconActive[i] === type) {
            firstHalf = iconActive.slice(0, i);
            lastHalf = iconActive.slice(i + 1);
          } else {
            iconActive.push(type);
          }
        }
        iconActive = firstHalf.concat(lastHalf);
      }

      return {
        iconActive
      };
    });
  };

  render() {
    const { classes } = this.props;
    const { iconActive } = this.state;
    return (
      <Toolbar className={classes.container}>
        <Fab
          onClick={event => this.handleOnClick(event, "bold")}
          size="medium"
          className={
            iconActive.includes("bold") ? classes.iconActive : classes.icon
          }
        >
          <Icon className={classNames("fas fa-bold")} />
        </Fab>

        <Fab
          onClick={event => this.handleOnClick(event, "italic")}
          size="medium"
          className={
            iconActive.includes("italic") ? classes.iconActive : classes.icon
          }
        >
          <Icon className={classNames("fas fa-italic")} />
        </Fab>

        <Fab
          onClick={event => this.handleOnClick(event, "strikethrough")}
          size="medium"
          className={
            iconActive.includes("strikethrough")
              ? classes.iconActive
              : classes.icon
          }
        >
          <Icon className={classNames("fas fa-strikethrough")} />
        </Fab>

        <Fab
          onClick={event => this.handleOnClick(event, "underline")}
          size="medium"
          className={
            iconActive.includes("underline") ? classes.iconActive : classes.icon
          }
        >
          <Icon className={classNames("fas fa-underline")} />
        </Fab>

        <Fab
          size="medium"
          className={
            iconActive.includes("link") ? classes.iconActive : classes.icon
          }
          onMouseDown={event => this.handleOnClick(event, "link")}
        >
          <Icon className={classNames("fas fa-link")} />
        </Fab>

        <Fab
          size="medium"
          className={
            iconActive.includes("image") ? classes.iconActive : classes.icon
          }
          onMouseDown={event => this.handleOnClick(event, "image")}
        >
          <Icon className={classNames("fas fa-images")} />
        </Fab>
      </Toolbar>
    );
  }
}

export default withStyles(styles)(TextEditorToolbar);
