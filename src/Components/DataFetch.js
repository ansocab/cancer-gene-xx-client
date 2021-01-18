import React, { useState, useEffect, useContext } from 'react'
import DataDownload from './DataDownload'
import { SearchContext } from '../Helpers/search'
import '../App.css'

export default function DataFetch(props) {
	const [idArray, setIdArray] = useState([])
	const { searchSummary } = useContext(SearchContext)

	useEffect(() => {
		getDataFetchManifest()
	}, [])

	function getDataFetchManifest() {
		let searchArray = [
			{
				op: 'in',
				content: {
					field: 'cases.project.project_id',
					value: searchSummary.project,
				},
			},
			{
				op: 'in',
				content: {
					field: 'data_category',
					value: searchSummary.category,
				},
			},
			{
				op: 'in',
				content: {
					field: 'data_type',
					value: searchSummary.data_type,
				},
			},
		]

		if (searchSummary.workflow.length !== 0) {
			searchArray.push({
				op: 'in',
				content: {
					field: 'analysis.workflow_type',
					value: searchSummary.workflow,
				},
			})
		}

		if (searchArray.length) {
			console.log('start fetch', searchArray)
			fetch('https://api.gdc.cancer.gov/v0/graphql', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					query: `
					query WorkflowFileCounts($filters: FiltersArgument) {
						viewer {
							repository {
						files {
							  hits(first: 20, filters: $filters) {
								edges {
								  node {
								   file_id    
								}
							}
						} }
					   }}
						  }`,
					variables: {
						filters: {
							op: 'and',
							content: searchArray,
						},
					},
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					buildIdArray(res.data.viewer.repository.files.hits.edges)
				})
		} else {
			console.log(searchArray)
		}
	}

	function buildIdArray(results) {
		let helperArray = []
		results.map((manifest) => helperArray.push(manifest.node.file_id))
		setIdArray(helperArray)
		console.log(helperArray)
	}

	return <>{idArray.length && <DataDownload idArray={idArray} />}</>
}
