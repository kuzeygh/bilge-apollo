import React, { Component } from "react";
import UserDisplay from "./UserDisplay";
import UserLogin from "./UserLogin";
import PostCreate from "./PostCreate";
import PostCreateWithImage from "./PostCreateWithImage";
import PostDisplay from "./PostDisplay";
import TextEditor from "./TextEditor";
import TextEditorDisplay from "./TextEditorDisplay";
import { AUTH_TOKEN, APP_SECRET } from "../constants";

import { withStyles } from "@material-ui/core/styles";
import { Link, Switch, withRouter, Route } from "react-router-dom";
import { Grid, MenuList, MenuItem, ListItemText } from "@material-ui/core";
import jwt from "jsonwebtoken";

/////Styles Başlangıcı////

const styles = theme => ({
  root: {
    display: "flex"
  },
  gridLeft: {
    backgroundColor: "#e0e0e0",
    height: "100vh"
  },
  menuList: {
    margin: 0,
    paddingTop: 0
  }
});

/////Component Başlangıcı////

class MainLayout extends Component {
  render() {
    const { classes } = this.props;
    const authToken = localStorage.getItem(AUTH_TOKEN);

    const { userId } = authToken ? jwt.verify(authToken, APP_SECRET) : "";
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={2}>
            <MenuList className={classes.menuList}>
              {authToken && (
                <MenuItem component={Link} to="/postcreate">
                  <ListItemText primary="Makale Yaz" />
                </MenuItem>
              )}
              {authToken && (
                <MenuItem component={Link} to={`/user/${userId}`}>
                  <ListItemText primary="Hesap" />
                </MenuItem>
              )}
              {!authToken && (
                <MenuItem component={Link} to="/userlogin">
                  <ListItemText primary="Giriş" />
                </MenuItem>
              )}

              {authToken && (
                <MenuItem
                  onClick={() => {
                    localStorage.removeItem(AUTH_TOKEN);
                    this.props.history.push("/");
                  }}
                >
                  <ListItemText primary="Çıkış" />
                </MenuItem>
              )}
              <MenuItem component={Link} to="/yazboz">
                <ListItemText primary="Yaz Boz" />
              </MenuItem>
              <MenuItem component={Link} to="/texteditor">
                <ListItemText primary="Text Editor" />
              </MenuItem>
              <MenuItem component={Link} to="/texteditordisplay">
                <ListItemText primary="Text Editor Display" />
              </MenuItem>
            </MenuList>
          </Grid>

          <Grid item xs={10} className={classes.gridLeft}>
            <Switch>
              <Route exact path="/postcreate" component={PostCreate} />
              <Route path={`/user/:id`} component={UserDisplay} />
              <Route exact path="/userlogin" component={UserLogin} />
              <Route path={`/post/:id`} component={PostDisplay} />
              <Route exact path="/yazboz" component={PostCreateWithImage} />
              <Route exact path="/texteditor" component={TextEditor} />
              <Route
                exact
                path="/texteditordisplay"
                component={TextEditorDisplay}
              />
            </Switch>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(MainLayout));
