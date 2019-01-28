import React from "react";
import ReactDOM from "react-dom";

import "typeface-roboto";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { AUTH_TOKEN } from "./constants";

import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { BrowserRouter } from "react-router-dom";
import { setContext } from "apollo-link-context";
import { createUploadLink } from "apollo-upload-client";
import { withClientState } from "apollo-link-state";
import CssBaseline from "@material-ui/core/CssBaseline";
import defaults from "./resolvers/defaults";
import resolvers from "./resolvers/resolvers";

//Subscriptions modules
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const uploadAndHttpLink = createUploadLink({
  uri: "http://localhost:4000"
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

// Cache Kuruluyor

const cache = new InMemoryCache({
  dataIdFromObject: object => object.id
});

// Apollo'da local state kullanımı için defaults ve resolversler geçiyor.

const stateLink = withClientState({
  cache,
  resolvers,
  defaults
});

// WebSocket link ayarlaması yapılıyor
const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000",
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
});

// Linkler websocket link olup olmamasına göre ayırıma tabi tutuluyor.
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  stateLink.concat(authLink.concat(uploadAndHttpLink))
);

// Linkler alınarak client için option olarak veriliyor

const client = new ApolloClient({
  cache,
  link
});

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />

    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.Fragment>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
