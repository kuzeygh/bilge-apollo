import React, { Component } from "react";
import { Editor } from "slate-react";

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
        <Editor
          value={this.props.value}
          renderMark={this.renderMark}
          readOnly={this.props.published ? true : false}
        />
      </div>
    );
  }
}

export default TextEditorDisplay;
