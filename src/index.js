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

const cache = new InMemoryCache();

// Apollo'da local state kullanımı için defaults ve resolversler geçiyor.

const stateLink = withClientState({
  cache,
  resolvers,
  defaults
});

// Linkler alınarak client için option olarak veriliyor

const client = new ApolloClient({
  cache,
  link: stateLink.concat(authLink.concat(uploadAndHttpLink))
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
