import React, { useEffect, useState, useContext } from 'react'
// import download from "downloadjs";
import untar from 'js-untar'

import { SearchContext } from '../Helpers/search'

// const extract = require("extract-zip");
const pako = require('pako')

// fetch everything DONE
// "unarchive" DONE
// for each unarchived file, ungzip it DONE
// for each ungzipped file, find the correct line of text, save to object with key=filename, value=value of matching

export default function App(props) {
	const { search } = useContext(SearchContext)
	const [results, setResults] = useState([])

	const unarchive = async function (stuff) {
		// console.log(stuff);
		let unzippedFiles = []
		await untar(stuff).progress(function (extractedFile) {
			// console.log(extractedFile);
			const newFileOutput = pako.ungzip(extractedFile.buffer, {
				to: 'string',
			})
			unzippedFiles.push({ [extractedFile.name]: newFileOutput })
		})
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
			.then((r) => unarchive(r, 'test-download.tar.gz'))
			.then((files) => {
				console.log(files)
				setResults(
					files.map((file) => {
						console.log(Object.keys(file)[0], Object.values(file)[0])
						var fileLines = Object.values(file)[0].split('\n')
						for (var i = 0; i < fileLines.length; i++) {
							var y = fileLines[i].split('\t')
							if (y[0].includes(search)) {
								return { [Object.keys(file)[0]]: y[1] }
							}
						}
						return { [Object.keys(file)[0]]: 'no match' }
					})
				)
			})
	}, [])
	return (
		<div className='App'>
			{search}
			{results.map((r) => (
				<li>
					{r && Object.keys(r)[0]} {Object.values(r)[0]}
				</li>
			))}
		</div>
	)
}
