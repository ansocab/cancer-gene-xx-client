import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import '../App.css'

export default function DataFetch(props) {
	console.log(props)
	const [dataFetchManifest, setDataFetchManifest] = useState([])

	function getDataFetchManifest() {
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
                          hits(first: 1000, filters: $filters) {
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
						content: [
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
							{
								op: 'in',
								content: {
									field: 'analysis.workflow_type',
									value: props.workflow,
								},
							},
						],
					},
				},
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				setDataFetchManifest(res.data.viewer.repository.files.hits.edges)
			})
	}

	useEffect(() => {
		getDataFetchManifest()
	}, [props.workflow])

	return (
		<>
			<div>
				{dataFetchManifest ? (
					<ol>
						{dataFetchManifest.map((manifest) => (
							<li>{manifest.node.file_id}</li>
						))}
					</ol>
				) : (
					<h1>loading available GDC workflows...</h1>
				)}
			</div>
		</>
	)
}