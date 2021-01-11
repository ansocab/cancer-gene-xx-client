import React, { useState, useEffect } from 'react'
import GdcDataTypeChoice from './GdcDataTypeChoice'
import '../App.css'

export default function GdcCategoryChoice() {
	const [gdcCategories, setGdcCategories] = useState([])
	const [uniqueCategories, setUniqueCategories] = useState([])
	const [selectedCategory, setSelectedCategory] = useState([])

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
                          hits(first: 10, filters: $filters) {
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
						content: { field: 'project_id', value: ['TCGA*'] },
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

	const handleClick = (e) => {
		setSelectedCategory(e.target.value)
		console.log(selectedCategory)
	}

	return (
		<>
			<div>
				{uniqueCategories ? (
					uniqueCategories.map((category) => (
						<button value={category} onClick={handleClick}>
							{category}
						</button>
					))
				) : (
					<h1>loading available GDC projects...</h1>
				)}
			</div>
			<div>
				{selectedCategory.length > 0 && (
					<GdcDataTypeChoice category={selectedCategory} />
				)}
			</div>
		</>
	)
}
