import React, { useState, createContext } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchSummary, setSearchSummary] = useState({});
  const [cancerData, setCancerData] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);

  return (
    <SearchContext.Provider
      value={{
        searchSummary,
        setSearchSummary,
        cancerData,
        setCancerData,
        loadingResults,
        setLoadingResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
