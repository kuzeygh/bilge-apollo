import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Editor } from "slate-react";
import { Value } from "slate";
import { Paper } from "@material-ui/core";
import { initialValue } from "./TextEditor";

const TAKE_POST = gql`
  query TakePost($postId: ID!) {
    postById(postId: $postId) {
      title
      content2
    }
  }
`;

class TextEditorDisplay extends Component {
  renderMark = (props, editor, next) => {
    switch (props.mark.type) {
      case "bold":
        return <strong>{props.children}</strong>;
      case "code":
        return <code>{props.children}</code>;
      case "italic":
        return <em>{props.children}</em>;
      case "strikethrough":
        return <del>{props.children}</del>;
      case "underline":
        return <u>{props.children}</u>;
      default:
        return next();
    }
  };

  render() {
    return (
      <div>
        <Query
          query={TAKE_POST}
          variables={{ postId: "cjqyktim9euza0a898sa3vgae" }}
        >
          {({ loading, error, data }) => {
            if (loading) return <div>Loading</div>;
            if (error) return <div>Error</div>;

            let content2 = data.postById.content2;
            content2 = JSON.parse(content2);
            content2 = Value.fromJSON(content2);

            return (
              <div>
                <Paper>
                  <Editor
                    value={content2}
                    renderMark={this.renderMark}
                    readOnly
                  />
                </Paper>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default TextEditorDisplay;
