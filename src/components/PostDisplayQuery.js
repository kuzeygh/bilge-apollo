import React, { Component } from "react";
import PostDisplayRequest from "./PostDisplayRequest";
import PostDisplay from "./PostDisplay";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";

class PostDisplayQuery extends Component {
  render() {
    const { match, client } = this.props;

    const post = client.readFragment({
      id: match.params.id,
      fragment: gql`
        fragment MyPost on Post {
          id
          title
          content
          published
          votes {
            id
          }
        }
      `,
      fragmentName: "MyPost"
    });

    if (post) {
      return <PostDisplay post={post} />;
    }

    return <PostDisplayRequest display={true} />;
  }
}

export default withApollo(PostDisplayQuery);
