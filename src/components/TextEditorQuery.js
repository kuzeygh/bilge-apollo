import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const TAKE_POST = gql`
  query TakePost($postId: ID!) {
    postById(postId: $postId) {
      id
      title
      content
      published
      author {
        id
        name
        email
      }
    }
  }
`;

class TextEditorQuery extends Component {
  render() {
    const { postId } = this.props;

    return (
      <React.Fragment>
        <Query
          query={TAKE_POST}
          variables={{ postId }}
          onCompleted={data => {
            this.props.onCompleted(data);
          }}
          fetchPolicy="network-only"
        >
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>Error...</div>;
            return true;
          }}
        </Query>
      </React.Fragment>
    );
  }
}

export default TextEditorQuery;
