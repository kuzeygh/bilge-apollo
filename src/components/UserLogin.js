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
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { AUTH_TOKEN } from "../constants";

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

const SIGNUP_MUTATION = gql`
  mutation SignUpMutation(
    $name: String!
    $email: String!
    $password1: String!
  ) {
    createUser(name: $name, email: $email, password: $password1) {
      token
      user {
        id
      }
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`;

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

  _confirm = async data => {
    const { token } = this.state.login ? data.loginUser : data.createUser;
    const userId = this.state.login
      ? data.loginUser.user.id
      : data.createUser.user.id;
    console.log(userId);
    this._saveUserData(token);
    this.props.history.push(`/user/${userId}`);
  };

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
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
    const password = password1;
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
            <Mutation
              mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
              variables={{ email, name, password }}
              onCompleted={data => this._confirm(data)}
            >
              {signupOrLogin => (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttons}
                  onClick={signupOrLogin}
                >
                  {login ? "Giriş" : "Üye Ol"}
                </Button>
              )}
            </Mutation>

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
