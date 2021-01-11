import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import GdcDataTypeChoice from './GdcDataTypeChoice'
import '../App.css'

export default function GdcCategoryChoice(props) {
	const [gdcCategories, setGdcCategories] = useState([])
	const [uniqueCategories, setUniqueCategories] = useState([])
	const [selectedCategory, setSelectedCategory] = useState([])
	const [showDataType, setShowDataType] = useState(false)

	function getGdcCategories() {
		fetch('https://api.gdc.cancer.gov/v0/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: `
                query DataCategoryFileCounts($filters: FiltersArgument) {
                        projects {
                          hits(first: 1000, filters: $filters) {
                            edges {
                              node {
                               project_id
                                
                                summary {
                                  data_categories {
                                    data_category
                                    file_count
                                  }
                                }
                              }
                            }
                        }
                    } 
                      }`,
				variables: {
					filters: {
						op: '=',
						content: { field: 'project_id', value: props.project },
					},
				},
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				setGdcCategories(res.data.projects.hits.edges)
			})
	}

	useEffect(() => {
		getGdcCategories()
	}, [])

	useEffect(() => {
		showCategories()
	}, [gdcCategories])

	function showCategories() {
		let helperSet = new Set()
		gdcCategories.map((category) =>
			category.node.summary.data_categories.map((subcategory) =>
				helperSet.add(subcategory.data_category)
			)
		)

		setUniqueCategories(Array.from(helperSet))
	}

	const handleChange = (e) => {
		const selection = e.target.name
		let previousSelection = selectedCategory

		if (e.target.checked) {
			previousSelection.push(selection)
		} else {
			const index = selectedCategory.indexOf(selection)
			previousSelection.splice(index, 1)
		}
		setSelectedCategory(previousSelection)
		setShowDataType(true)
		console.log(selectedCategory)
	}

	return (
		<>
			<div>
				{uniqueCategories ? (
					<Form>
						{uniqueCategories.map((category) => (
							<Form.Group controlId='formBasicCheckbox'>
								<Form.Check
									type='checkbox'
									name={category}
									label={category}
									onChange={handleChange}
								/>
							</Form.Group>
						))}
					</Form>
				) : (
					<h1>loading available GDC data categories...</h1>
				)}
			</div>
			<div>
				{showDataType && (
					<>
						<GdcDataTypeChoice
							category={selectedCategory}
							project={props.project}
						/>
					</>
				)}
			</div>
		</>
	)
}
