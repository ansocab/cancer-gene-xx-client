import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import '../App.css'

export default function DataDownload(props) {
	console.log(props)

	function getData() {
		fetch('https://api.gdc.cancer.gov/v0/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: `
                query WorkflowFileCounts{
                    ids:[
                        "556e5e3f-0ab9-4b6c-aa62-c42f6a6cf20c"]
                    }`,
			}),
		})
			.then((res) => res.json())
			.then((res) => console.log(res))
	}

	useEffect(() => {
		getData()
	}, [props.idArray])

	return <p>Download in progress...</p>
}
