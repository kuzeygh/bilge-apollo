import React from "react";
import { MenuItem, ListItemText } from "@material-ui/core";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  menuLinks: {
    borderLeft: "1px solid blue"
  }
});

const PublicLinks = ({ classes }) => (
  <React.Fragment>
    <MenuItem component={Link} to="/" className={classes.menuLinks}>
      <ListItemText primary="Ana Sayfa" />
    </MenuItem>
    <MenuItem component={Link} to="/userlogin" className={classes.menuLinks}>
      <ListItemText primary="Giriş" />
    </MenuItem>
  </React.Fragment>
);

export default withStyles(styles)(PublicLinks);
