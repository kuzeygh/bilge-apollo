import React, { Component } from "react";
import { Editor } from "slate-react";
import { Button, Toolbar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

// const existingValue = JSON.parse(localStorage.getItem("content"));

// const plugins = [
//   MarkHotKey({ key: "b", type: "bold" }),
//   MarkHotKey({ key: "ö", type: "code" }),
//   MarkHotKey({ key: "i", type: "italic" }),
//   MarkHotKey({ key: "~", type: "strikethrough" }),
//   MarkHotKey({ key: "u", type: "underline" })
// ];

function wrapLink(editor, href) {
  editor.wrapInline({
    type: "link",
    data: { href }
  });
  editor.moveToEnd();
}

function unwrapLink(editor) {
  editor.unwrapInline("link");
}

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

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props;
    switch (node.type) {
      case "link": {
        const { data } = node;
        const href = data.get("href");
        console.log(attributes, href);
        return (
          <Typography
            {...attributes}
            href={href}
            component="a"
            inline
            cursor="pointer"
            target="_blank"
          >
            {children}
          </Typography>
        );
      }
      default: {
        return next();
      }
    }
  };

  ref = editor => {
    this.editor = editor;
  };

  hasLinks = () => {
    const { value } = this.props;
    return value.inlines.some(inline => inline.type === "link");
  };

  onClickLink = event => {
    event.preventDefault();
    const { editor } = this;
    const { value } = editor;
    const hasLinks = this.hasLinks();

    if (hasLinks) {
      editor.command(unwrapLink);
    } else if (value.selection.isExpanded) {
      const href = window.prompt("Enter the URL of the link");
      if (href === null) {
        return;
      }

      editor.command(wrapLink, href);
    } else {
      const href = window.prompt("Enter the URL of the link:");
      if (href === null) {
        return;
      }
      const text = window.prompt("Enter the text for the link");
      if (text == null) {
        return;
      }
      editor
        .insertText(text)
        .moveFocusBackward(text.length)
        .command(wrapLink, href);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {!this.props.display && (
          <Toolbar>
            <Button
              variant="contained"
              className={classes.editorButtons}
              onClick={event => this.MarkHotKey(event, { type: "bold" })}
            >
              Kalın
            </Button>
            <Button
              variant="contained"
              className={classes.editorButtons}
              onClick={event => this.MarkHotKey(event, { type: "code" })}
            >
              Kod
            </Button>
            <Button
              variant="contained"
              className={classes.editorButtons}
              onClick={event => this.MarkHotKey(event, { type: "italic" })}
            >
              İtalic
            </Button>
            <Button
              variant="contained"
              className={classes.editorButtons}
              onClick={event =>
                this.MarkHotKey(event, { type: "strikethrough" })
              }
            >
              Üstü Çizili
            </Button>
            <Button
              variant="contained"
              className={classes.editorButtons}
              onClick={event => this.MarkHotKey(event, { type: "underline" })}
            >
              Alt Yazılı
            </Button>
            <Button
              variant="contained"
              className={classes.editorButtons}
              onMouseDown={this.onClickLink}
            >
              Link
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
            renderNode={this.renderNode}
          />
        </div>
      </div>
    );
  }
}
// Add a `renderMark` method to render marks.

export default withStyles(styles)(TextEditor);
