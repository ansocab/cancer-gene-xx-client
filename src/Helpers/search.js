import React, { useState, createContext } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchSummary, setSearchSummary] = useState({});
  const [cancerData, setCancerData] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [onDataClose, setOnDataClose] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        searchSummary,
        setSearchSummary,
        cancerData,
        setCancerData,
        loadingResults,
        setLoadingResults,
        onDataClose,
        setOnDataClose,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
