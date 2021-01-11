import React, { useState, useEffect } from 'react'
import GdcWorkflowChoice from './GdcWorkflowChoice'
import '../App.css'

export default function GdcDataTypeChoice(props) {
	const [gdcDataTypes, setGdcDataTypes] = useState([])
	const [uniqueDataType, setUniqueDataType] = useState([])
	const [selectedType, setSelectedType] = useState([])

	function getGdcDataTypes() {
		fetch('https://api.gdc.cancer.gov/v0/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: `
                query DataTypeFileCounts($filters: FiltersArgument) {
                    viewer {
                        repository {
                    files {
                          hits(first: 10, filters: $filters) {
                            edges {
                              node {
                               file_id
                               data_category
                            data_type
                            
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
									value: ['TCGA-LIHC'],
								},
							},
							{
								op: 'in',
								content: {
									field: 'data_category',
									value: [props.category],
								},
							},
						],
					},
				},
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				setGdcDataTypes(res.data.viewer.repository.files.hits.edges)
			})
	}

	useEffect(() => {
		getGdcDataTypes()
	}, [props.category])

	useEffect(() => {
		showDataTypes()
	}, [gdcDataTypes])

	function showDataTypes() {
		let helperSet = new Set()
		gdcDataTypes.map((dataType) => helperSet.add(dataType.node.data_type))

		setUniqueDataType(Array.from(helperSet))
	}

	const handleClick = (e) => {
		setSelectedType(e.target.value)
		console.log(selectedType)
	}

	return (
		<>
			<div>
				{uniqueDataType ? (
					uniqueDataType.map((type) => (
						<button value={type} onClick={handleClick}>
							{type}
						</button>
					))
				) : (
					<h1>loading available GDC projects...</h1>
				)}
			</div>
			<div>
				{selectedType.length > 0 && (
					<GdcWorkflowChoice
						dataType={selectedType}
						category={props.category}
					/>
				)}
			</div>
		</>
	)
}
