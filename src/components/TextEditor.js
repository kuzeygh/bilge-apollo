import React, { Component } from "react";
import { Editor } from "slate-react";
import { Value } from "slate";
import { Paper } from "@material-ui/core";

const existingValue = JSON.parse(localStorage.getItem("content"));
const initialValue = Value.fromJSON(
  existingValue || {
    document: {
      nodes: [
        {
          object: "block",
          type: "paragraph",
          nodes: [
            {
              object: "text",
              leaves: [
                {
                  text: "A line of text in a paragraph."
                }
              ]
            }
          ]
        }
      ]
    }
  }
);

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
  state = {
    value: initialValue
  };

  onChange = ({ value }) => {
    // Save the value to Local Storage

    if (value.document != this.state.value.document) {
      const content = JSON.stringify(value.toJSON());
      localStorage.setItem("content", content);
    }

    this.setState({ value });
  };

  render() {
    return (
      <Paper>
        <Editor
          plugins={plugins}
          value={this.state.value}
          onChange={this.onChange}
          // Add the `renderMark` prop...
          renderMark={this.renderMark}
        />

        <button>Gönder</button>
      </Paper>
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
