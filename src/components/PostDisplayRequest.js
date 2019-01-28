import React, { Component } from "react";
import { Query } from "react-apollo";
import { withRouter } from "react-router-dom";
import gql from "graphql-tag";
import PostDisplay from "./PostDisplay";
import PostEdit from "./PostEdit";

const TAKE_POST = gql`
  query TakePost($postId: ID!) {
    postById(postId: $postId) {
      id
      title
      content
      published
      votes {
        id
      }
    }
  }
`;

class PostDisplayRequest extends Component {
  render() {
    const postId = this.props.match.params.id;
    const { display } = this.props;
    return (
      <Query query={TAKE_POST} variables={{ postId }}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error...</div>;

          const post = data.postById;
          if (display) {
            return <PostDisplay post={post} />;
          }
          return <PostEdit post={post} firstQuery={true} />;
        }}
      </Query>
    );
  }
}

export default withRouter(PostDisplayRequest);
