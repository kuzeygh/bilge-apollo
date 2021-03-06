import React, { Component } from "react";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import PostEdit from "./PostEdit";
import PostDisplayRequest from "./PostDisplayRequest";

class TextEditorQuery extends Component {
  render() {
    const { match, client } = this.props;
    const postId = match.params.id;

    const post = client.readFragment({
      id: postId,
      fragment: gql`
        fragment MyPost on Post {
          id
          title
          content
          published
        }
      `,
      fragmentName: "MyPost"
    });

    if (post) {
      return <PostEdit post={post} firstQuery={true} />;
    }
    return <PostDisplayRequest display={false} />;
  }
}

export default withApollo(TextEditorQuery);
