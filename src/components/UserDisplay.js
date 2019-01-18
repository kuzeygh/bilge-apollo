import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Typography, Paper, List, AppBar, Tabs, Tab } from "@material-ui/core";
import PostListItem from "./PostListItem";
import { AUTH_TOKEN, APP_SECRET } from "../constants";
import jwt from "jsonwebtoken";
import SwipeableViews from "react-swipeable-views";

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
  },
  tabContainer: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    margin: "10px"
  }
});

export const TAKE_USER = gql`
  query TakeUser($userId: ID!) {
    userById(userId: $userId) {
      id
      name
      email
      posts {
        id
        title
        content
        published
      }
    }
  }
`;

class UserDisplay extends Component {
  state = {
    value: 0
  };

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme } = this.props;
    const { value } = this.state;
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const { userId } = authToken ? jwt.verify(authToken, APP_SECRET) : "";

    return (
      <div className={classes.root}>
        <Query query={TAKE_USER} variables={{ userId }}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>Error...</div>;

            const user = data.userById;
            const posts = data.userById.posts;
            const publishedPosts = posts.filter(
              post => post.published === true
            );
            const notPublishedPosts = posts.filter(
              post => post.published === false
            );
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
                  <div className={classes.tabContainer}>
                    <AppBar position="static" color="default">
                      <Tabs
                        value={value}
                        onChange={this.handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                      >
                        <Tab label="Taslaklar" />
                        <Tab label="Yayınlar" />
                      </Tabs>
                    </AppBar>
                    <SwipeableViews
                      axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                      index={value}
                      onChangeIndex={this.handleChangeIndex}
                    >
                      <TabContainer dir={theme.direction}>
                        <List component="nav">
                          {notPublishedPosts.map(post => (
                            <PostListItem
                              post={post}
                              key={post.id}
                              user={user}
                            />
                          ))}
                        </List>
                      </TabContainer>
                      <TabContainer dir={theme.direction}>
                        <List component="nav">
                          {publishedPosts.map(post => (
                            <PostListItem
                              post={post}
                              key={post.id}
                              user={user}
                            />
                          ))}
                        </List>
                      </TabContainer>
                    </SwipeableViews>
                  </div>
                </div>
              </Paper>
            );
          }}
        </Query>
      </div>
    );
  }
}

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

export default withStyles(styles, { withTheme: true })(UserDisplay);
