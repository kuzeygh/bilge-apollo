import React, { Component } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton
} from "@material-ui/core";
import {
  AccountBoxTwoTone,
  EmailTwoTone,
  HttpsTwoTone,
  VisibilityOutlined,
  VisibilityOffOutlined
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  rootContainer: {
    width: "800px",
    margin: "40px auto"
  },
  root: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 5
  },
  loginheader: {
    textAlign: "center"
  },
  textFieldContainer: {
    padding: theme.spacing.unit * 15
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center"
  },
  buttons: {
    margin: theme.spacing.unit * 2
  }
});

class UserLogin extends Component {
  state = {
    name: "",
    email: "",
    password1: "",
    password2: "",
    showPassword: false,
    login: true
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  showPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleClick = () => {
    this.setState(state => ({ login: !state.login }));
  };

  render() {
    const { classes } = this.props;
    const {
      name,
      email,
      password1,
      password2,
      showPassword,
      login
    } = this.state;
    return (
      <div className={classes.rootContainer}>
        <Paper className={classes.root} spacing={1}>
          <div className={classes.loginheader}>
            {login ? (
              <Typography variant="h4">Giriş Yapın</Typography>
            ) : (
              <Typography variant="h4">Üye Olun</Typography>
            )}
          </div>
          <div className={classes.textFieldContainer}>
            {!login && (
              <TextField
                placeholder="Kullanıcı Adı"
                margin="normal"
                id="name"
                value={name}
                fullWidth
                className={classes.textFields}
                onChange={this.handleChange("name")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxTwoTone fontSize="large" />
                    </InputAdornment>
                  )
                }}
              />
            )}

            <TextField
              placeholder="Email"
              margin="normal"
              id="email"
              type="email"
              fullWidth
              className={classes.textFields}
              value={email}
              onChange={this.handleChange("email")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailTwoTone fontSize="large" />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              placeholder="Şifre"
              margin="normal"
              id="password1"
              type={showPassword ? "text" : "password"}
              fullWidth
              className={classes.textFields}
              value={password1}
              onChange={this.handleChange("password1")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HttpsTwoTone fontSize="large" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={this.showPassword}>
                      {showPassword ? (
                        <VisibilityOutlined />
                      ) : (
                        <VisibilityOffOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {!login && (
              <TextField
                placeholder="Şifre Tekrar"
                margin="normal"
                id="password2"
                type={showPassword ? "text" : "password"}
                fullWidth
                className={classes.textFields}
                value={password2}
                onChange={this.handleChange("password2")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HttpsTwoTone fontSize="large" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={this.showPassword}>
                        {showPassword ? (
                          <VisibilityOutlined />
                        ) : (
                          <VisibilityOffOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}
          </div>

          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              className={classes.buttons}
            >
              {login ? "Giriş" : "Üye Ol"}
            </Button>

            <Button
              variant="outlined"
              color="default"
              className={classes.buttons}
              onClick={this.handleClick}
            >
              {login ? "Hesap aç" : "Hesabım Var"}
            </Button>
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(UserLogin);
