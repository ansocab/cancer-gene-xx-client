import React, { useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import EnsgSearch from "./Components/EnsgSearch";
import GdcProjectChoice from "./Components/GdcProjectChoice";
import GdcCategoryChoice from "./Components/GdcCategoryChoice";
import Profile from "./Components/Profile";
import "bootswatch/dist/flatly/bootstrap.min.css";
import "./App.css";
import ProfileManager from "./Components/ProfileManager";
import { ProfileContext } from "./ProfileContext";

function App() {
  const { checkIfLoggedIn } = useContext(ProfileContext);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <ProfileManager />
          <EnsgSearch />
        </Route>
        <Route path="/profile">
          <Profile />
          <EnsgSearch />
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
