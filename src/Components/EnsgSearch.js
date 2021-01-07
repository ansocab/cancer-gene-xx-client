import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function EnsgSearch() {
  const [ensgNumber, setensgNumber] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [firstSearchResults, setFirstSearchResults] = useState([]);
  const history = useHistory();

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
        history.push(res.response.docs[0].ensembl_gene_id);
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
    <>
      <form onSubmit={handleSubmit} style={{ margin: "60px" }}>
        <input
          type="text"
          placeholder="Gene in any name"
          onChange={handleChange}
          value={inputValue}
        ></input>
        <Button variant="primary" type="submit" style={{ marginLeft: "10px" }}>
          Submit
        </Button>
      </form>
      <ul>
        {firstSearchResults.map((result) => (
          <li key={result.hgnc_id}>
            <Button
              variant="primary"
              value={result.hgnc_id}
              onClick={handleClick}
            >
              {result.symbol}
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
}
