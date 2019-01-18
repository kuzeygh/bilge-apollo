import React, { Component } from "react";
import { Editor, getEventRange, getEventTransfer } from "slate-react";
import { Block } from "slate";
import { Button, Toolbar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import isUrl from "is-url";
import ImageExtensions from "image-extensions";

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

const schema = {
  document: {
    last: { type: "paragraph" },
    normalize: (editor, { code, node, child }) => {
      switch (code) {
        case "last_child_type_invalid": {
          const paragraph = Block.create("paragraph");
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
      }
    }
  },
  blocks: {
    image: {
      isVoid: true
    }
  }
};

function insertImage(editor, src, target) {
  if (target) {
    editor.select(target);
  }

  editor.insertBlock({
    type: "image",
    data: { src }
  });
}

function isImage(url) {
  return !!ImageExtensions.find(url.endsWith);
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
      case "image": {
        const src = node.data.get("src");

        return (
          <Typography
            {...attributes}
            src={src}
            component="img"
            style={{
              maxWidth: "100%",
              maxHeight: "20rem",
              border: "none",
              display: "block",
              borderRadius: "0.5rem"
            }}
          />
        );
      }
      case "link": {
        const { data } = node;
        const href = data.get("href");

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

  onDropOrPaste = (event, editor, next) => {
    const target = getEventRange(event, editor);
    if (!target && event.type === "drop") return next();

    const transfer = getEventTransfer(event);
    const { type, text, files } = transfer;

    if (type === "files") {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");
        if (mime !== "image") continue;

        reader.addEventListener("load", () => {
          editor.command(insertImage, reader.result, target);
        });

        reader.readAsDataURL(file);
      }
      return;
    }

    if (type === "text") {
      if (!isUrl(text)) return next();
      if (!isImage(text)) return next();
      editor.command(insertImage, text, target);
      return;
    }

    next();
  };

  onClickImage = event => {
    event.preventDefault();
    const src = window.prompt("Enter the URL of the image");
    if (!src) return;
    this.editor.command(insertImage, src);
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
            <Button
              variant="contained"
              className={classes.editorButtons}
              onMouseDown={this.onClickImage}
            >
              Resim
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
            schema={schema}
            onDrop={this.onDropOrPaste}
            onPaste={this.onDropOrPaste}
          />
        </div>
      </div>
    );
  }
}
// Add a `renderMark` method to render marks.

export default withStyles(styles)(TextEditor);
