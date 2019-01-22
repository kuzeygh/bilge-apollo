import React from "react";
import { MenuList } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PublicLinks from "./PublicLinks";
import PrivateLinks from "./PrivateLinks.js";

const styles = theme => ({
  menuList: {
    backgroundColor: "#eceff1",
    display: "flex",
    flexDirection: "column",
    borderRadius: "0.5rem"
  }
});

const MainLinks = ({ classes, userLogin }) => {
  return (
    <React.Fragment>
      <MenuList className={classes.menuList}>
        {userLogin.userId ? (
          <PrivateLinks userLogin={userLogin} />
        ) : (
          <PublicLinks />
        )}
      </MenuList>
    </React.Fragment>
  );
};

export default withStyles(styles)(MainLinks);
