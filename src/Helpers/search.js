import React, { useState, createContext } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchSummary, setSearchSummary] = useState({});
  const [cancerData, setCancerData] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [openDataSelection, setOpenDataSelection] = useState(true);
  const [openResults, setOpenResults] = useState(false);
  const [openBoxPlot, setOpenBoxPlot] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [categorySet, setCategorySet] = useState([]);
  const [showPlot, setShowPlot] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        searchSummary,
        setSearchSummary,
        cancerData,
        setCancerData,
        loadingResults,
        setLoadingResults,
        openDataSelection,
        setOpenDataSelection,
        openResults,
        setOpenResults,
        openBoxPlot,
        setOpenBoxPlot,
        selectedSort,
        setSelectedSort,
        categorySet,
        setCategorySet,
        showPlot,
        setShowPlot,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
