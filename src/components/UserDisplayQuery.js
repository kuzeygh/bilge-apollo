import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { AUTH_TOKEN, APP_SECRET } from "../constants";
import jwt from "jsonwebtoken";
import UserDisplay from "./UserDisplay";
import { withApollo } from "react-apollo";

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
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const { userId } = authToken ? jwt.verify(authToken, APP_SECRET) : "";

    return (
      <Query query={TAKE_USER} variables={{ userId }}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error...</div>;
          const user = data.userById;
          const { posts } = data.userById;
          const { tabIndex } = data.userById.tabStatus;

          return <UserDisplay user={user} posts={posts} tabIndex={tabIndex} />;
        }}
      </Query>
    );
  }
}

export default withApollo(UserDisplayQuery);
