import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { SearchContext } from "./Helpers/search";
import EnsgSearch from "./Components/EnsgSearch";
import GdcProjectChoice from "./Components/GdcProjectChoice";
import Profile from "./Components/Profile";
import ProfileManager from "./Components/ProfileManager";
import SaveSearch from "./Components/SaveSearch";
import Navigation from "./Components/Navigation";
import { Container } from "react-bootstrap";
import "bootswatch/dist/flatly/bootstrap.min.css";
import "./App.css";

function App() {
  const { searchSummary } = useContext(SearchContext);

  return (
    <div className="App">
      <Navigation />
      <Container>
        <Switch>
          <Route exact path="/">
            <EnsgSearch />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/:ensgNumber">
            <GdcProjectChoice />
            {Object.keys(searchSummary).length !== 0 && <SaveSearch />}
          </Route>
        </Switch>
      </Container>
    </div>
  );
}

export default App;
