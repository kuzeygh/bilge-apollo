import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import UserDisplay from "./UserDisplay";
import { withApollo } from "react-apollo";
import { _TAKE_USER_ID } from "./MainLayout";

export const TAKE_USER = gql`
  query TakeUser($userId: ID!) {
    userPostsById(userId: $userId) {
      posts {
        id
        title
        content
        published
      }
    }
  }
`;

class UserDisplayQuery extends Component {
  render() {
    const { userLogin, userSettings } = this.props.client.readQuery({
      query: _TAKE_USER_ID
    });

    const { userId } = userLogin;
    const { activeList } = userSettings;

    return (
      <Query query={TAKE_USER} variables={{ userId }}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error...</div>;

          const { posts } = data.userPostsById;

          return (
            <UserDisplay
              userLogin={userLogin}
              posts={posts}
              activeList={activeList}
            />
          );
        }}
      </Query>
    );
  }
}

export default withApollo(UserDisplayQuery);
