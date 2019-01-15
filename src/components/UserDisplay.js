import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";
import { Link } from "react-router-dom";

const styles = theme => ({
  root: {
    margin: "40px auto",
    maxWidth: "800px",
    padding: "1rem"
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    padding: "1rem"
  },
  textFields: {
    marginLeft: "1rem",
    color: "#9e9e9e"
  },
  listContainer: {
    padding: "1rem"
  }
});

const TAKE_USER = gql`
  query TakeUser($userId: ID!) {
    userById(userId: $userId) {
      id
      name
      email
      posts {
        id
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
              <Paper className={classes.root}>
                <div className={classes.headerContainer}>
                  <Typography variant="h4" className={classes.textFields}>
                    {user.name}
                  </Typography>
                  <Typography varint="h6" className={classes.textFields}>
                    {user.email}
                  </Typography>
                </div>

                <div className={classes.listContainer}>
                  <Typography variant="h4" color="primary">
                    Makaleler
                  </Typography>
                  <List component="nav">
                    {posts.map(post => (
                      <ListItem button component={Link} to={`/post/${post.id}`}>
                        <ListItemText primary={post.title} />
                      </ListItem>
                    ))}
                  </List>
                </div>
              </Paper>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default withStyles(styles)(UserDisplay);
