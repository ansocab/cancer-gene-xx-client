import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// import download from "downloadjs";
import untar from 'js-untar'
import BoxPlot from './BoxPlot'
import CollapsableCard from './CollapsableCard'
import Loading from './Loading'

// const extract = require("extract-zip");
const pako = require('pako')

// fetch everything DONE
// "unarchive" DONE
// for each unarchived file, ungzip it DONE
// for each ungzipped file, find the correct line of text, save to object with key=filename, value=value of matching

export default function DataDownload(props) {
	const { ensgNumber } = useParams()
	console.log(ensgNumber)
	const [results, setResults] = useState([])
	const [boxPlotValues, setBoxPlotValues] = useState([])

	const unarchive = async function (files) {
		let unzippedFiles = []
		console.log('this is happening', files)
		try {
			await untar(files).progress(function (extractedFile) {
				const newFileOutput = pako.ungzip(extractedFile.buffer, {
					to: 'string',
				})
				unzippedFiles.push({ [extractedFile.name]: newFileOutput })
			})
		} catch (err) {}
		return unzippedFiles
	}

	useEffect(() => {
		fetch('https://api.gdc.cancer.gov/data?tarfile', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				ids: props.idArray,
			}),
		})
			.then((r) => r.arrayBuffer())
			.then((r) => unarchive(r))
			.then((files) => {
				setResults(
					files.map((file) => {
						var fileLines = Object.values(file)[0].split('\n')
						for (var i = 0; i < fileLines.length; i++) {
							var y = fileLines[i].split('\t')
							if (y[0].includes(ensgNumber)) {
								return { [Object.keys(file)[0]]: y[1] }
							}
						}
						return { [Object.keys(file)[0]]: 'no match' }
					})
				)
			})
	}, [])

	useEffect(() => {
		fetch('https://api.gdc.cancer.gov/v0/graphql', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: `
                query additionalData($filters: FiltersArgument){
                    viewer {
                        repository {
                    files {
                          hits(first: 1000, filters: $filters) {
                            edges {
                              node {
                               file_id
                               data_category
							data_type
							
						
                            annotations{
                                case_id
							}
						
							cases{
								diagnosis{
									tumor_grade
									state
								}
								demographics{
									days_to_death
									gender
									vital_status
								}
								samples{
									sample_type
								}
							}                            
                            }
                        }
                    } }
                   }}
                      }`,
				variables: {
					filters: {
						op: '=',
						content: { field: 'file.file_id', value: props.idArray },
					},
				},
			}),
		})
			.then((r) => r.json())
			.then((r) => {
				console.log(r)
			})
	}, [])

	useEffect(() => {
		getBoxPlotData()
	}, [results])

	function getBoxPlotData() {
		let helperArray = []
		results.map((r) => helperArray.push(Object.values(r)[0]))
		setBoxPlotValues(helperArray.map((i) => Number(i)))
	}

	return (
		<div>
			<CollapsableCard title={`Results for ${ensgNumber}`}>
				<table class='table table-hover'>
					<thead>
						<tr class='table-primary'>
							<th scope='col'>File name</th>
							<th scope='col'>FPKM of {ensgNumber}</th>
						</tr>
					</thead>
					<tbody>
						{results.length ? (
							results.map((r) => (
								<tr>
									<td>{r && Object.keys(r)[0]}</td>
									<td>{Object.values(r)[0]}</td>
								</tr>
							))
						) : (
							<Loading />
						)}
					</tbody>
				</table>
			</CollapsableCard>
			{boxPlotValues.length && <BoxPlot boxPlotValues={boxPlotValues} />}
		</div>
	)
}
