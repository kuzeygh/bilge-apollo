import React, { Component } from "react";
import { Editor } from "slate-react";
import { Button, Toolbar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

// const existingValue = JSON.parse(localStorage.getItem("content"));

// const plugins = [
//   MarkHotKey({ key: "b", type: "bold" }),
//   MarkHotKey({ key: "ö", type: "code" }),
//   MarkHotKey({ key: "i", type: "italic" }),
//   MarkHotKey({ key: "~", type: "strikethrough" }),
//   MarkHotKey({ key: "u", type: "underline" })
// ];

const styles = theme => ({
  buttonContainer: {
    margin: "20px",
    display: "flex",
    justifyContent: "center"
  },
  editorContainer: {
    marginTop: "20px",
    borderTop: "1px solid #ccc",
    padding: "10px"
  },
  editorButtons: {
    marginRight: "10px"
  }
});

class TextEditor extends Component {
  MarkHotKey(event, options) {
    event.preventDefault();
    const { type } = options;

    this.editor.toggleMark(type);
  }

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

  ref = editor => {
    this.editor = editor;
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {!this.props.display && (
          <Toolbar>
            <Button
              variant="raised"
              className={classes.editorButtons}
              onClick={event => this.MarkHotKey(event, { type: "bold" })}
            >
              Kalın
            </Button>
            <Button
              variant="raised"
              className={classes.editorButtons}
              onClick={event => this.MarkHotKey(event, { type: "code" })}
            >
              Kod
            </Button>
            <Button
              variant="raised"
              className={classes.editorButtons}
              onClick={event => this.MarkHotKey(event, { type: "italic" })}
            >
              İtalic
            </Button>
            <Button
              variant="raised"
              className={classes.editorButtons}
              onClick={event =>
                this.MarkHotKey(event, { type: "strikethrough" })
              }
            >
              Üstü Çizili
            </Button>
            <Button
              variant="raised"
              className={classes.editorButtons}
              onClick={event => this.MarkHotKey(event, { type: "underline" })}
            >
              Alt Yazılı
            </Button>
          </Toolbar>
        )}

        <div className={classes.editorContainer}>
          <Editor
            // plugins={plugins}
            value={this.props.value}
            onChange={this.props.readOnly ? null : this.props.onChange}
            renderMark={this.renderMark}
            readOnly={this.props.readOnly}
            placeholder={this.props.placeholder}
            ref={this.ref}
          />
        </div>
      </div>
    );
  }
}
// Add a `renderMark` method to render marks.

export default withStyles(styles)(TextEditor);
