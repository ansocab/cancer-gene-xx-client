import React, { useState } from "react";
import "./App.css";

function App() {
  const [ensgNumber, setensgNumber] = useState("");
  const [inputValue, setInputValue] = useState("");

  function getEnsgNumber(name) {
    fetch(`http://rest.genenames.org/fetch/symbol/${name}`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.response.docs.length !== 0) {
          console.log(res.response.docs[0].ensembl_gene_id);
          setensgNumber(res.response.docs[0].ensembl_gene_id);
        } else {
          setensgNumber("nothing found");
        }
      });
  }

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputValue);
    getEnsgNumber(inputValue);
  };

  return (
    <div className="App">
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
      {ensgNumber}
    </div>
  );
}

export default App;
