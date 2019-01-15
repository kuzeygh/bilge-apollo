import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Typography } from "@material-ui/core";

const styles = theme => ({
  root: {
    margin: "40px auto"
  }
});

const TAKE_USER = gql`
  query TakeUser($userId: ID!) {
    userById(userId: $userId) {
      id
      name
      email
      posts {
        title
      }
    }
  }
`;

class UserDisplay extends Component {
  render() {
    const { classes } = this.props;
    const userId = this.props.match.params.id;
    console.log(userId);
    return (
      <div className={classes.root}>
        <Query query={TAKE_USER} variables={{ userId }}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>Error...</div>;

            const user = data.userById;
            const posts = data.userById.posts;
            return (
              <div>
                <Typography variant="h2">{user.name}</Typography>
                <Typography varint="h3">{user.email}</Typography>
                <Typography variant="h4">{user.id}</Typography>
                <ul>
                  {posts.map(post => (
                    <li>{post.title}</li>
                  ))}
                </ul>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default withStyles(styles)(UserDisplay);
