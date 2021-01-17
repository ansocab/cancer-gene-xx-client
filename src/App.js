import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { SearchContext } from "./Helpers/search";
import EnsgSearch from "./Components/EnsgSearch";
import GdcProjectChoice from "./Components/GdcProjectChoice";
import SavedSearches from "./Components/SavedSearches";
import SavedSearchesDetail from "./Components/SavedSearchesDetail";
import SaveSearch from "./Components/SaveSearch";
import Navigation from "./Components/Navigation";
import DataFetch from "./Components/DataFetch";
import { Container } from "react-bootstrap";
import "bootswatch/dist/flatly/bootstrap.min.css";
import "./App.css";

function App() {
  const { searchSummary, startDataFetch } = useContext(SearchContext);

  return (
    <div className="App">
      <Navigation />
      <Container>
        <Switch>
          <Route exact path="/">
            <EnsgSearch />
          </Route>
          <Route path="/savedsearches/:searchId">
            <SavedSearchesDetail />
          </Route>
          <Route path="/savedsearches">
            <SavedSearches />
          </Route>
          <Route path="/:ensgNumber">
            {Object.keys(searchSummary).length !== 0 && <SaveSearch />}
            <GdcProjectChoice />
            {Object.keys(searchSummary).length !== 0 && <DataFetch />}
          </Route>
        </Switch>
      </Container>
    </div>
  );
}

export default App;
