import jwt from "jsonwebtoken";
import { AUTH_TOKEN, APP_SECRET } from "../constants";

const authToken = localStorage.getItem(AUTH_TOKEN);
const { userId, name, email } = authToken
  ? jwt.verify(authToken, APP_SECRET)
  : "";

const defaults = {
  mutate: {
    errorPolicy: "all"
  },
  tabStatus: {
    __typename: "TabStatus",
    tabIndex: 0
  },
  userLogin: {
    __typename: "UserLogin",
    userId: userId || null,
    name: name || null,
    email: email || null
  }
};

export default defaults;
