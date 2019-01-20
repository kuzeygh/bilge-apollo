import React, { Component } from "react";
import { Editor, getEventRange, getEventTransfer } from "slate-react";
import { Block } from "slate";
import { Button, Toolbar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import isUrl from "is-url";
import ImageExtensions from "image-extensions";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";

// const existingValue = JSON.parse(localStorage.getItem("content"));

// const plugins = [
//   MarkHotKey({ key: "b", type: "bold" }),
//   MarkHotKey({ key: "ö", type: "code" }),
//   MarkHotKey({ key: "i", type: "italic" }),
//   MarkHotKey({ key: "~", type: "strikethrough" }),
//   MarkHotKey({ key: "u", type: "underline" })
// ];

const CREATE_POST_IMAGE = gql`
  mutation CreatePostImage($picture: Upload!) {
    createPostImage(picture: $picture) {
      id
      pictureURL
    }
  }
`;

const QUERY_POST_IMAGE = gql`
  query ImageById($imageId: ID!) {
    imageById(imageId: $imageId) {
      pictureURL
    }
  }
`;

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
      // eslint-disable-next-line
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
  },
  boldFont: {
    fontWeight: "bold"
  }
});

class TextEditor extends Component {
  MarkHotKey(event, options) {
    event.preventDefault();
    const { type } = options;

    this.editor.toggleMark(type);
  }

  renderMark = (props, editor, next) => {
    const { attributes } = props;
    switch (props.mark.type) {
      case "bold":
        return (
          <Typography {...attributes} style={{ fontWeight: "bold" }} inline>
            {props.children}
          </Typography>
        );

      case "italic":
        return (
          <Typography {...attributes} component="em" inline>
            {props.children}
          </Typography>
        );
      case "strikethrough":
        return (
          <Typography {...attributes} component="del" inline>
            {props.children}
          </Typography>
        );
      case "underline":
        return (
          <Typography {...attributes} component="u" inline>
            {props.children}
          </Typography>
        );
      default:
        return next();
    }
  };

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props;
    switch (node.type) {
      case "paragraph": {
        return (
          <Typography {...attributes} variant="body1">
            {children}
          </Typography>
        );
      }

      case "image": {
        const src = node.data.get("src");

        return (
          <Typography
            {...attributes}
            src={src}
            component="img"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "50%",
              height: "50%",
              textAlign: "center",
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
        const [mime] = file.type.split("/");
        if (mime !== "image") continue;

        this.props.client
          .mutate({
            mutation: CREATE_POST_IMAGE,
            variables: { picture: file }
          })
          .then(response1 => {
            return this.props.client
              .query({
                query: QUERY_POST_IMAGE,
                variables: { imageId: response1.data.createPostImage.id }
              })
              .then(response2 => {
                return editor.command(
                  insertImage,
                  response2.data.imageById.pictureURL,
                  target
                );
              });
          })
          .catch(error => console.log(error));
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

export default withStyles(styles)(withApollo(TextEditor));
