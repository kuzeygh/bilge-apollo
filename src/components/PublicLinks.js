import React from "react";
import { MenuItem, ListItemText } from "@material-ui/core";
import { Link } from "react-router-dom";

const PublicLinks = () => (
  <React.Fragment>
    <MenuItem component={Link} to="/userlogin">
      <ListItemText primary="Giriş" />
    </MenuItem>
  </React.Fragment>
);

export default PublicLinks;
