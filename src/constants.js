import { Value } from "slate";

export const AUTH_TOKEN = "auth-token";
export const APP_SECRET = "bilge-graphql";

export const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: ""
              }
            ]
          }
        ]
      }
    ]
  }
});
