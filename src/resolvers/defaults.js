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
  userSettings: {
    __typename: "UserSettings",
    activeList: "draft"
  },
  userLogin: {
    __typename: "UserLogin",
    userId: userId || null,
    name: name || null,
    email: email || null
  }
};

export default defaults;
