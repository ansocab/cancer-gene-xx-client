import React, { useState, useEffect } from 'react'
import './App.css'

export default function GdcProjectChoice() {
	const [gdcProjects, setGdcProjects] = useState([])

	function getGdcProjects() {
		fetch('https://api.gdc.cancer.gov/v0/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: `
			  
			  query PROJECTS_EDGES($filters_1: FiltersArgument) {
				projects {
				  hits(first: 1000, filters: $filters_1) {
					total
					edges {
					  node {
						name
						project_id
				  
					  }
					}
				  }
				}
			  }
			`,
				variables: {
					filters_1: {
						op: '=',
						content: { field: 'project_id', value: ['TCGA*'] },
					},
				},
			}),
		})
			.then((res) => res.json())
			.then((res) => setGdcProjects(res.data.projects.hits.edges))
	}

	useEffect(() => {
		getGdcProjects()
	}, [])

	if (gdcProjects) {
		console.log(gdcProjects)
		return (
			<>
				<ul>
					{gdcProjects.map((project) => (
						<li key={project.node.project_id}>{project.node.name}</li>
					))}
				</ul>
			</>
		)
	} else {
		return <h1>loading available GDC projects...</h1>
	}
}
