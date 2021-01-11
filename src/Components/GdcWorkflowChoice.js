import React, { useState, useEffect } from 'react'
import '../App.css'

export default function GdcWorkflowChoice(props) {
	console.log(props.dataType, props.category)
	const [gdcWorkflows, setGdcWorkflows] = useState([])
	const [uniqueWorkflow, setUniqueWorkflow] = useState([])

	function getGdcWorkflows() {
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
                          hits(first: 10, filters: $filters) {
                            edges {
                              node {
                               file_id
                               data_category
                            data_type
                            analysis{
                                workflow_type
                            }
                            
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
						],
					},
				},
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				setGdcWorkflows(res.data.viewer.repository.files.hits.edges)
			})
	}

	useEffect(() => {
		getGdcWorkflows()
	}, [props.dataType])

	useEffect(() => {
		showWorkflows()
	}, [gdcWorkflows])

	function showWorkflows() {
		let helperSet = new Set()
		gdcWorkflows.map((workflow) =>
			helperSet.add(workflow.node.analysis.workflow_type)
		)
		setUniqueWorkflow(Array.from(helperSet))
	}

	if (uniqueWorkflow) {
		return (
			<>
				<ul>
					{uniqueWorkflow.map((type) => (
						<li key={type}>{type}</li>
					))}
				</ul>
			</>
		)
	} else {
		return <h1>loading available GDC projects...</h1>
	}
}
