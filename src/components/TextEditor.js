import React, { Component } from "react";
import { Editor } from "slate-react";

// const existingValue = JSON.parse(localStorage.getItem("content"));

function MarkHotKey(options) {
  const { type, key } = options;

  return {
    onKeyDown(event, editor, next) {
      if (event.key !== key || !event.ctrlKey) return next();
      event.preventDefault();
      editor.toggleMark(type);
    }
  };
}

const plugins = [
  MarkHotKey({ key: "b", type: "bold" }),
  MarkHotKey({ key: "ö", type: "code" }),
  MarkHotKey({ key: "i", type: "italic" }),
  MarkHotKey({ key: "~", type: "strikethrough" }),
  MarkHotKey({ key: "u", type: "underline" })
];

class TextEditor extends Component {
  render() {
    return (
      <div>
        <Editor
          plugins={plugins}
          value={this.props.value}
          onChange={this.props.readOnly ? null : this.props.onChange}
          renderMark={this.renderMark}
          readOnly={this.props.readOnly}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }

  // Add a `renderMark` method to render marks.
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
}

export default TextEditor;
