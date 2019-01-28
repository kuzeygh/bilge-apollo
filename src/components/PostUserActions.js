import React, { Component } from "react";
import { Icon } from "@material-ui/core";
import classNames from "classnames";

class PostUserActions extends Component {
  render() {
    return (
      <React.Fragment>
        <Icon className={classNames("fas fa-thumbs-up")} />
      </React.Fragment>
    );
  }
}

export default PostUserActions;
