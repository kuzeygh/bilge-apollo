import React, { Component } from "react";
import { Editor, getEventRange, getEventTransfer } from "slate-react";
import { Block } from "slate";
import { Typography, Link, Grow } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import isUrl from "is-url";
import ImageExtensions from "image-extensions";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import TextEditorToolbar from "./TextEditorToolbar";
import { loadCSS } from "fg-loadcss/src/loadCSS";

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

  boldFont: {
    fontWeight: "bold"
  },
  fontContainer: {
    display: "inline-block",
    margin: 0,
    padding: 0
  }
});

class TextEditor extends Component {
  // Font-Awesom Yükleme işlemi
  componentDidMount() {
    loadCSS(
      "https://use.fontawesome.com/releases/v5.6.3/css/all.css",
      document.querySelector("#insertion-point-jss")
    );
  }

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
          <Grow in>
            <div className={this.props.classes.fontContainer}>
              <Typography {...attributes} style={{ fontWeight: "bold" }} inline>
                {props.children}
              </Typography>
            </div>
          </Grow>
        );

      case "italic":
        return (
          <Grow in>
            <div className={this.props.classes.fontContainer}>
              <Typography {...attributes} component="em" inline>
                {props.children}
              </Typography>
            </div>
          </Grow>
        );
      case "strikethrough":
        return (
          <Grow in>
            <div className={this.props.classes.fontContainer}>
              <Typography {...attributes} component="del" inline>
                {props.children}
              </Typography>
            </div>
          </Grow>
        );
      case "underline":
        return (
          <Grow in>
            <div className={this.props.classes.fontContainer}>
              <Typography {...attributes} component="u" inline>
                {props.children}
              </Typography>
            </div>
          </Grow>
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
          <Grow in>
            <div className={this.props.classes.fontContainer}>
              <Typography
                {...attributes}
                src={src}
                component="img"
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "30%",
                  height: "30%",
                  textAlign: "center",
                  display: "block",
                  borderRadius: "0.5rem"
                }}
              />
            </div>
          </Grow>
        );
      }
      case "link": {
        const { data } = node;
        const href = data.get("href");
        console.log(href);

        return (
          <Grow in>
            <div className={this.props.classes.fontContainer}>
              <Link href={href} {...attributes} inline target="_blank">
                {children}
              </Link>
            </div>
          </Grow>
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

        /* 
          RESİM YÜKLE VE AL
        */

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
          <TextEditorToolbar
            onClick={(event, { type }) => this.MarkHotKey(event, { type })}
            onClickLink={event => this.onClickLink(event)}
            onClickImage={event => this.onClickImage(event)}
          />
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
