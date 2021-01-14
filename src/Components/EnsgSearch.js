import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { SearchContext } from '../Helpers/search'

export default function EnsgSearch() {
	const { setSearch } = useContext(SearchContext)
	const [inputValue, setInputValue] = useState('')
	const [firstSearchResults, setFirstSearchResults] = useState([])
	const history = useHistory()

	function getHgncId(input) {
		fetch(`http://rest.genenames.org/search/${input}`, {
			headers: { Accept: 'application/json' },
		})
			.then((res) => res.json())
			.then((res) => {
				setFirstSearchResults(res.response.docs)
			})
	}

	function getEnsgNumber(name) {
		const url = `http://rest.genenames.org/fetch/hgnc_id/${name}`
		fetch(url, {
			headers: { Accept: 'application/json' },
		})
			.then((res) => res.json())
			.then((res) => {
				setSearch(res.response.docs[0].ensembl_gene_id)
				history.push(res.response.docs[0].ensembl_gene_id)
			})
	}

	const handleChange = (e) => {
		setInputValue(e.target.value)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		getHgncId(inputValue)
	}

	const handleClick = (e) => {
		getEnsgNumber(e.target.getAttribute('value'))
	}

	return (
		<div className='ensg-search-container'>
			<form onSubmit={handleSubmit} style={{ margin: '60px' }}>
				<input
					type='text'
					className='form-control'
					id='inputDefault'
					placeholder='Gene in any name'
					onChange={handleChange}
					value={inputValue}
				></input>
				<Button
					className='mt-3'
					variant='primary'
					type='submit'
					style={{ marginLeft: '10px' }}
				>
					Search
				</Button>
			</form>
			<ul className='list-group'>
				{firstSearchResults.map((result) => (
					<li
						className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
						key={result.hgnc_id}
						value={result.hgnc_id}
						onClick={handleClick}
					>
						{result.symbol}
					</li>
				))}
			</ul>
		</div>
	)
}
