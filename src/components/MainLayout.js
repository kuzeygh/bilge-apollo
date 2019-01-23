import React, { Component } from "react";
import UserDisplayQuery from "./UserDisplayQuery";
import UserLogin from "./UserLogin";
import PostCreate from "./PostCreate";
import PostDisplayQuery from "./PostDisplayQuery";

import TextEditorQuery from "./TextEditorQuery";

import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import { withStyles } from "@material-ui/core/styles";
import { Switch, Route } from "react-router-dom";
import { Grid } from "@material-ui/core";
import MainLinks from "./MainLinks";

export const _TAKE_USER_ID = gql`
  query _TakeUserId @client {
    userLogin {
      userId
      name
      email
    }
    userSettings {
      activeList
    }
  }
`;

const styles = theme => ({
  root: {
    display: "flex",
    width: "100%",
    height: "150vh",
    backgroundColor: "#cfd8dc"
  },
  gridLeft: {
    padding: "1rem",
    borderRadius: "0.5rem"
  },
  gridRight: {
    padding: "3rem"
  },
  menuList: {
    backgroundColor: "#acacac",
    display: "flex",
    flexDirection: "column"
  }
});

/////Component Başlangıcı////

class MainLayout extends Component {
  render() {
    const { classes } = this.props;

    const { userLogin } = this.props.client.readQuery({
      query: _TAKE_USER_ID
    });

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={2} className={classes.gridLeft}>
            <MainLinks userLogin={userLogin} />
          </Grid>

          <Grid item xs={10} className={classes.gridRight}>
            <Switch>
              <Route exact path="/postcreate" component={PostCreate} />
              <Route path={`/user/:id`} component={UserDisplayQuery} />
              <Route exact path="/userlogin" component={UserLogin} />
              <Route exact path={`/post/:id`} component={PostDisplayQuery} />
              <Route path={`/post/edit/:id`} component={TextEditorQuery} />
            </Switch>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(withApollo(MainLayout));
