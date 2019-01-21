import jwt from "jsonwebtoken";
import { AUTH_TOKEN, APP_SECRET } from "../constants";

const authToken = localStorage.getItem(AUTH_TOKEN);
const { userId } = authToken ? jwt.verify(authToken, APP_SECRET) : "";

const defaults = {
  tabStatus: {
    __typename: "TabStatus",
    tabIndex: 0
  },
  userLogin: {
    __typename: "UserLogin",
    userId: userId || null
  }
};

export default defaults;
