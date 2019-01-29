import React, { Component } from "react";
import { Icon, IconButton } from "@material-ui/core";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
// import { TAKE_USER } from "./UserDisplayQuery";

const styles = theme => ({
  buttonContainer: {
    margin: theme.spacing.unit * 2,
    color: "blue"
  }
});

const CREATE_VOTE = gql`
  mutation CreateVote($postId: ID!) {
    createVote(postId: $postId) {
      id
    }
  }
`;

class PostUserActions extends Component {
  render() {
    const { classes, postId } = this.props;

    return (
      <React.Fragment>
        <Mutation mutation={CREATE_VOTE} variables={{ postId }}>
          {createVoteMutation => (
            <IconButton
              className={classes.buttonContainer}
              onClick={createVoteMutation}
            >
              <Icon className={classNames("fas fa-thumbs-up")} />
            </IconButton>
          )}
        </Mutation>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PostUserActions);
