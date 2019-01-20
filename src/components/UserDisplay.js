import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import { Typography, List, AppBar, Tabs, Tab } from "@material-ui/core";
import PostListItem from "./PostListItem";
import SwipeableViews from "react-swipeable-views";

const styles = theme => ({
  root: {
    maxWidth: "1400px",
    margin: "auto",
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

const UPDATE_TAB_INDEX = gql`
  mutation UpdateTabIndex($tabIndex: Int!) {
    updateTabIndex(tabIndex: $tabIndex) @client
  }
`;

class UserDisplay extends Component {
  state = {
    index: this.props.tabIndex
  };

  handleChangeIndex = ({ index }) => {
    const tabIndex = index;
    this.props.client.mutate({
      mutation: UPDATE_TAB_INDEX,
      variables: { tabIndex }
    });
    this.setState({ index });
  };

  handleTabChange = (event, value) => {
    const tabIndex = value;
    this.props.client.mutate({
      mutation: UPDATE_TAB_INDEX,
      variables: { tabIndex }
    });
    this.setState({ index: value });
  };

  render() {
    const { classes, theme, user, posts } = this.props;

    const { index } = this.state;

    const publishedPosts = posts.filter(post => post.published === true);
    const notPublishedPosts = posts.filter(post => post.published === false);
    return (
      <div className={classes.root}>
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
                value={index}
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
              index={index}
              onChangeIndex={this.handleChangeIndex}
            >
              <TabContainer dir={theme.direction}>
                <List component="nav">
                  {notPublishedPosts.map(post => (
                    <PostListItem post={post} key={post.id} user={user} />
                  ))}
                </List>
              </TabContainer>
              <TabContainer dir={theme.direction}>
                <List component="nav">
                  {publishedPosts.map(post => (
                    <PostListItem post={post} key={post.id} user={user} />
                  ))}
                </List>
              </TabContainer>
            </SwipeableViews>
          </div>
        </div>
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

export default withStyles(styles, { withTheme: true })(withApollo(UserDisplay));
