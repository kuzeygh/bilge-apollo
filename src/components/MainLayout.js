import React, { Component } from "react";
import UserDisplay from "./UserDisplay";
import PostCreate from "./PostCreate";
import { withStyles } from "@material-ui/core/styles";
import { Link, Switch, withRouter, Route } from "react-router-dom";
import { Grid, MenuList, MenuItem, ListItemText } from "@material-ui/core";

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
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={2}>
            <MenuList className={classes.menuList}>
              <MenuItem component={Link} to="/postcreate">
                <ListItemText primary="Makale Yaz" />
              </MenuItem>
              <MenuItem component={Link} to="/user">
                <ListItemText primary="Hesap" />
              </MenuItem>
            </MenuList>
          </Grid>

          <Grid item xs={10} className={classes.gridLeft}>
            <Switch>
              <Route exact path="/postcreate" component={PostCreate} />
              <Route exact path="/user" component={UserDisplay} />
            </Switch>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(MainLayout));
