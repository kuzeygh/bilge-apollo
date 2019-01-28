import React, { Component } from "react";
import MainLayout from "./components/MainLayout";
import { loadCSS } from "fg-loadcss/src/loadCSS";
import "./App.css";

class App extends Component {
  componentDidMount() {
    loadCSS(
      "https://use.fontawesome.com/releases/v5.6.3/css/all.css",
      document.querySelector("#insertion-point-jss")
    );
  }

  render() {
    return (
      <div className="App">
        <MainLayout />
      </div>
    );
  }
}

export default App;
