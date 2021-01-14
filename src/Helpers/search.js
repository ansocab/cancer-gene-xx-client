import React, { useState, createContext } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState();
  const [searchSummary, setSearchSummary] = useState({});

  return (
    <SearchContext.Provider
      value={{ search, setSearch, searchSummary, setSearchSummary }}
    >
      {children}
    </SearchContext.Provider>
  );
};
