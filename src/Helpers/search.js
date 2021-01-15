import React, { useState, createContext } from 'react'

export const SearchContext = createContext()

export const SearchProvider = ({ children }) => {
	const [searchSummary, setSearchSummary] = useState({})

	return (
		<SearchContext.Provider value={{ searchSummary, setSearchSummary }}>
			{children}
		</SearchContext.Provider>
	)
}
