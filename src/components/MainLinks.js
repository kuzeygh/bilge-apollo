import React from "react";
import { MenuList } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PublicLinks from "./PublicLinks";
import PrivateLinks from "./PrivateLinks.js";

const styles = theme => ({
  menuList: {
    backgroundColor: "#acacac",
    display: "flex",
    flexDirection: "column"
  }
});

const MainLinks = ({ classes, userId, history }) => {
  return (
    <React.Fragment>
      <MenuList className={classes.menuList}>
        {userId ? <PrivateLinks userId={userId} /> : <PublicLinks />}
      </MenuList>
    </React.Fragment>
  );
};

export default withStyles(styles)(MainLinks);
