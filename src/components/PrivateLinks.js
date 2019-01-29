import React from "react";
import { MenuItem, ListItemText } from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import { AUTH_TOKEN } from "../constants";
import { withApollo } from "react-apollo";
import { _TAKE_USER_ID } from "./MainLayout";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  menuLinks: {
    borderBottom: "1px solid #cfd8dc"
  }
});

const PrivateLinks = ({ history, userLogin, client, classes }) => (
  <React.Fragment>
    <MenuItem component={Link} to="/" className={classes.menuLinks}>
      <ListItemText primary="Ana Sayfa" />
    </MenuItem>
    <MenuItem component={Link} to="/postcreate" className={classes.menuLinks}>
      <ListItemText primary="Makale Yaz" />
    </MenuItem>
    <MenuItem
      component={Link}
      to={`/user/${userLogin.userId}`}
      className={classes.menuLinks}
    >
      <ListItemText primary="Hesap" />
    </MenuItem>
    <MenuItem
      onClick={() => {
        client.writeQuery({
          query: _TAKE_USER_ID,
          data: {
            userLogin: {
              userId: null,
              name: null,
              email: null,
              __typename: "UserLogin"
            }
          }
        });
        localStorage.removeItem(AUTH_TOKEN);

        history.push("/");
      }}
      className={classes.menuLinks}
    >
      <ListItemText primary="Çıkış" />
    </MenuItem>
  </React.Fragment>
);

export default withStyles(styles)(withRouter(withApollo(PrivateLinks)));
