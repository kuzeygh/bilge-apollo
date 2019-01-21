import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import UserDisplay from "./UserDisplay";
import { withApollo } from "react-apollo";
import { _TAKE_USER_ID } from "./MainLayout";

export const TAKE_USER = gql`
  query TakeUser($userId: ID!) {
    userById(userId: $userId) {
      id
      name
      email
      posts {
        id
        title
        content
        published
      }
      tabStatus @client {
        tabIndex
      }
    }
  }
`;

class UserDisplayQuery extends Component {
  render() {
    const { userLogin } = this.props.client.readQuery({
      query: _TAKE_USER_ID
    });
    const { userId } = userLogin;

    return (
      <Query query={TAKE_USER} variables={{ userId }}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error...</div>;

          const { posts } = data.userById;
          const { tabIndex } = data.userById.tabStatus;

          return (
            <UserDisplay user={userLogin} posts={posts} tabIndex={tabIndex} />
          );
        }}
      </Query>
    );
  }
}

export default withApollo(UserDisplayQuery);
