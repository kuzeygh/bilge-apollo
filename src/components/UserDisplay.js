import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grow } from "@material-ui/core";
// import gql from "graphql-tag";
import { withApollo } from "react-apollo";
// import { Typography } from "@material-ui/core";
import UserPostList from "./UserPostList";
// import { TAKE_USER } from "./UserDisplayQuery";
import UserNavigationButtons from "./UserNavigationButtons";

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

// const UPDATE_TAB_INDEX = gql`
//   mutation UpdateTabIndex($tabIndex: Int!) {
//     updateTabIndex(tabIndex: $tabIndex) @client
//   }
// `;

class UserDisplay extends Component {
  state = {
    // index: this.props.tabIndex,
    activeList: "",
    draftFlag: false
  };

  onClickList = ({ type, draftFlag }) => {
    this.setState({ activeList: type, draftFlag });
  };

  // Component dağıtılmadan önce
  // local state yi güncelliyoruz.
  // componentWillUnmount = async () => {
  //   const tabIndex = this.state.index;
  //   const tabIndexData = await this.props.client.mutate({
  //     mutation: UPDATE_TAB_INDEX,
  //     variables: { tabIndex }
  //   });

  //   const { userId } = this.props.userLogin;

  //   const queryData = await this.props.client.readQuery({
  //     query: TAKE_USER,
  //     variables: { userId }
  //   });

  //   queryData.userPostsById.tabStatus =
  //     tabIndexData.data.updateTabIndex.tabStatus;

  //   this.props.client.writeQuery({
  //     query: TAKE_USER,
  //     variables: { userId },
  //     data: queryData
  //   });
  // };

  render() {
    const { classes, userLogin, posts } = this.props;

    const { activeList } = this.state;

    const publishedPosts = posts.filter(post => post.published === true);
    const notPublishedPosts = posts.filter(post => post.published === false);

    console.log(publishedPosts, notPublishedPosts);
    return (
      <Grow in>
        <div className={classes.root}>
          <UserNavigationButtons
            onClick={({ type, draftFlag }) =>
              this.onClickList({ type, draftFlag })
            }
          />
          <div>
            {activeList === "draft" && (
              <UserPostList
                draftFlag={true}
                notPublishedPosts={notPublishedPosts}
                userLogin={userLogin}
              />
            )}
            {activeList === "published" && (
              <UserPostList
                draftFlag={true}
                publishedPosts={publishedPosts}
                userLogin={userLogin}
              />
            )}
          </div>
        </div>
      </Grow>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withApollo(UserDisplay));
