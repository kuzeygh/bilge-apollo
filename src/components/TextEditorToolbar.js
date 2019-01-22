import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Toolbar } from "@material-ui/core";

const styles = theme => ({
  editorButtons: {
    marginRight: "10px"
  }
});

const TextEditorToolbar = ({ onClick, onClickLink, onClickImage, classes }) => (
  <Toolbar>
    <Button
      variant="contained"
      className={classes.editorButtons}
      onClick={event => onClick(event, { type: "bold" })}
      // onClick={event => this.MarkHotKey(event, { type: "bold" })}
    >
      Kalın
    </Button>

    <Button
      variant="contained"
      className={classes.editorButtons}
      onClick={event => onClick(event, { type: "italic" })}
      // onClick={event => this.MarkHotKey(event, { type: "italic" })}
    >
      İtalic
    </Button>
    <Button
      variant="contained"
      className={classes.editorButtons}
      onClick={event => onClick(event, { type: "strikethrough" })}
      // onClick={event =>
      //   this.MarkHotKey(event, { type: "strikethrough" })
      // }
    >
      Üstü Çizili
    </Button>
    <Button
      variant="contained"
      className={classes.editorButtons}
      onClick={event => onClick(event, { type: "underline" })}
      // onClick={event => this.MarkHotKey(event, { type: "underline" })}
    >
      Alt Yazılı
    </Button>
    <Button
      variant="contained"
      className={classes.editorButtons}
      onMouseDown={event => onClickLink(event)}
      // onMouseDown={this.onClickLink}
    >
      Link
    </Button>
    <Button
      variant="contained"
      className={classes.editorButtons}
      onMouseDown={event => onClickImage(event)}
    >
      Resim
    </Button>
  </Toolbar>
);

export default withStyles(styles)(TextEditorToolbar);
