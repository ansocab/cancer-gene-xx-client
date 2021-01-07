import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import EnsgSearch from "./Components/EnsgSearch";
import GdcProjectChoice from "./Components/GdcProjectChoice";
import GdcCategoryChoice from "./Components/GdcCategoryChoice";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import "bootswatch/dist/flatly/bootstrap.min.css";
import "./App.css";

function App() {
  useEffect(() => {
    fetch("http://localhost:4000", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "http://localhost:4000",
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <Login />
      <Switch>
        <Route exact path="/">
          <EnsgSearch />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/:ensgNumber">
          <GdcProjectChoice />
          <GdcCategoryChoice />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
