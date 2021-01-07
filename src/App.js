import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import GdcProjectChoice from "./GdcProjectChoice";
import GdcCategoryChoice from "./GdcCategoryChoice";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import "./App.css";

function App() {
  const [ensgNumber, setensgNumber] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [firstSearchResults, setFirstSearchResults] = useState([]);

  function getHgncId(input) {
    fetch(`http://rest.genenames.org/search/${input}`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        setFirstSearchResults(res.response.docs);
      });
  }

  function getEnsgNumber(name) {
    const url = `http://rest.genenames.org/fetch/hgnc_id/${name}`;
    fetch(url, {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        setensgNumber(res.response.docs[0].ensembl_gene_id);
      });
  }

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputValue);
    getHgncId(inputValue);
  };

  const handleClick = (e) => {
    console.log(e.target.value);
    getEnsgNumber(e.target.value);
  };

  return (
    <div className="App">
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
      </Switch>
      <form onSubmit={handleSubmit} style={{ margin: "60px" }}>
        <input
          type="text"
          placeholder="Gene in any name"
          onChange={handleChange}
          value={inputValue}
        ></input>
        <button type="submit" style={{ marginLeft: "10px" }}>
          Submit
        </button>
      </form>
      <ul>
        {firstSearchResults.map((result) => (
          <li key={result.hgnc_id}>
            <button value={result.hgnc_id} onClick={handleClick}>
              {result.symbol}
            </button>
          </li>
        ))}
      </ul>
      {ensgNumber}
      <GdcProjectChoice />
      <GdcCategoryChoice />
    </div>
  );
}

export default App;
