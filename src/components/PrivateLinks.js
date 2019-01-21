import React from "react";
import { MenuItem, ListItemText } from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import { AUTH_TOKEN } from "../constants";
import { withApollo } from "react-apollo";
import { _TAKE_USER_ID } from "./MainLayout";

const PrivateLinks = ({ history, userId, client }) => (
  <React.Fragment>
    <MenuItem component={Link} to="/postcreate">
      <ListItemText primary="Makale Yaz" />
    </MenuItem>
    <MenuItem component={Link} to={`/user/${userId}`}>
      <ListItemText primary="Hesap" />
    </MenuItem>
    <MenuItem
      onClick={() => {
        client.writeQuery({
          query: _TAKE_USER_ID,
          data: { userLogin: { userId: null, __typename: "UserLogin" } }
        });
        localStorage.removeItem(AUTH_TOKEN);

        history.push("/");
      }}
    >
      <ListItemText primary="Çıkış" />
    </MenuItem>
  </React.Fragment>
);

export default withRouter(withApollo(PrivateLinks));
