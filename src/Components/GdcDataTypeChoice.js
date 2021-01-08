import React, { useState, useEffect } from 'react'
import '../App.css'

export default function GdcDataTypeChoice() {
	const [gdcDataTypes, setGdcDataTypes] = useState([])
	const [uniqueDataType, setUniqueDataType] = useState([])

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
									value: ['Clinical'],
								},
							},
						],
					},
				},
			}),
		})
			// filters={"content":[{"content":{"field":"cases.project.project_id","value":["TCGA-LIHC"]},"op":"in"},{"content":{"field":"files.data_category","value":["transcriptome profiling"]},"op":"in"},{"content":{"field":"files.data_type","value":["Gene Expression Quantification"]},"op":"in"}],"op":"and"}
			.then((res) => res.json())
			.then((res) => {
				console.log(res)
			})
	}

	useEffect(() => {
		getGdcDataTypes()
	}, [])

	useEffect(() => {
		//showDataTypes()
	}, [gdcDataTypes])

	function showDataTypes() {
		let helperSet = new Set()
		gdcDataTypes.map((category) =>
			category.node.summary.data_DataTypes.map((subcategory) =>
				helperSet.add(subcategory.data_category)
			)
		)

		setUniqueDataType(Array.from(helperSet))
	}

	if (gdcDataTypes) {
		return (
			<>
				<ul>
					{gdcDataTypes.map((type) => (
						<li key={type}>{type}</li>
					))}
				</ul>
			</>
		)
	} else {
		return <h1>loading available GDC projects...</h1>
	}
}
