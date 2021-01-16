import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import DataDownload from './DataDownload'
import { SearchContext } from '../Helpers/search'
import '../App.css'

export default function DataFetch(props) {
	const { ensgNumber } = useParams()
	const [idArray, setIdArray] = useState([])
	const { setSearchSummary } = useContext(SearchContext)

	useEffect(() => {
		// Eventuell nur speichern, wenn Daten abrufbar
		setSearchSummary({
			ensg_number: ensgNumber,
			project: props.project,
			category: props.category,
			data_type: props.dataType,
			workflow: props.workflow,
		})
		getDataFetchManifest()
		console.log('i am trying to do something....')
	}, [])

	function getDataFetchManifest() {
		// SearchArray...?
		let searchArray = [
			{
				op: 'in',
				content: {
					field: 'cases.project.project_id',
					value: props.project,
				},
			},
			{
				op: 'in',
				content: {
					field: 'data_category',
					value: props.category,
				},
			},
			{
				op: 'in',
				content: {
					field: 'data_type',
					value: props.dataType,
				},
			},
		]

		if (props.workflow.length !== 0) {
			searchArray.push({
				op: 'in',
				content: {
					field: 'analysis.workflow_type',
					value: props.workflow,
				},
			})
		}

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
                          hits(first: 2, filters: $filters) {
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
	}

	function buildIdArray(results) {
		let helperArray = []
		results.map((manifest) => helperArray.push(manifest.node.file_id))
		setIdArray(helperArray)
		console.log(helperArray)
	}

	return <>{idArray.length && <DataDownload idArray={idArray} />}</>
}
