import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grow } from "@material-ui/core";
import { withApollo } from "react-apollo";
import UserPostList from "./UserPostList";
import UserNavigationButtons from "./UserNavigationButtons";
import { _TAKE_USER_ID } from "./MainLayout";
// import gql from "graphql-tag";

// const UPDATE_ACTIVE_LIST = gql`
//   mutation UpdateActiveList($activeList: String!) {
//     updateActiveList(activeList: $activeList) {
//       activeList
//     }
//   }
// `;

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

class UserDisplay extends Component {
  state = {
    draftFlag: false,
    activeList: this.props.activeList
  };

  onClickList = ({ type, draftFlag }) => {
    this.setState({ activeList: type, draftFlag });
    this.props.client.writeQuery({
      query: _TAKE_USER_ID,
      data: {
        userSettings: {
          __typename: "UserSettings",
          activeList: type
        }
      }
    });
  };

  // componentWillUnmount() {
  //   // Burada çıkışta user active listi lokale yazacağız.
  //   console.log(this.props.client, this.state.activeList);
  //   this.props.client.mutate({
  //     mutation: UPDATE_ACTIVE_LIST,
  //     variables: {
  //       activeList: this.state.activeList
  //     }
  //   });
  // }

  render() {
    const { classes, userLogin, posts } = this.props;
    const { activeList } = this.state;

    const publishedPosts = posts.filter(post => post.published === true);
    const notPublishedPosts = posts.filter(post => post.published === false);

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
