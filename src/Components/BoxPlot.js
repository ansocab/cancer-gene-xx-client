import React, { useEffect } from 'react'
import * as d3 from 'd3v4'

import CollapsableCard from './CollapsableCard'

export default function Boxplot(props) {
	function buildPlot() {
		console.log(props.cancerData)
		// set the dimensions and margins of the graph
		var margin = { top: 10, right: 30, bottom: 30, left: 40 },
			width = 460 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom

		// append the svg object to the body of the page
		var svg = d3
			.select('#my_dataviz')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

		// Read the data and compute summary statistics for each specie

		// Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
		d3.selectAll('g').data(props.cancerData.data)
		var sumstat = d3
			.nest() // nest function allows to group the calculation per level of a factor
			.key(function (d) {
				return d.gender
			})
			.rollup(function (d) {
				var q1 = d3.quantile(
					d
						.map(function (g) {
							return g.gene_value
						})
						.sort(d3.ascending),
					0.25
				)
				var median = d3.quantile(
					d
						.map(function (g) {
							return g.gene_value
						})
						.sort(d3.ascending),
					0.5
				)
				var q3 = d3.quantile(
					d
						.map(function (g) {
							return g.gene_value
						})
						.sort(d3.ascending),
					0.75
				)
				var interQuantileRange = q3 - q1
				var min = q1 - 1.5 * interQuantileRange
				var max = q3 + 1.5 * interQuantileRange
				return {
					q1: q1,
					median: median,
					q3: q3,
					interQuantileRange: interQuantileRange,
					min: min,
					max: max,
				}
			})
			.entries(props.cancerData.data)

		// Show the X scale
		var x = d3
			.scaleBand()
			.range([0, width])
			.domain(['male', 'female'])
			.paddingInner(1)
			.paddingOuter(0.5)
		svg
			.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(x))

		// Show the Y scale
		var y = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(props.cancerData.data, function (d) {
					return d.gene_value
				}),
			])
			.range([height, 0])
		svg.append('g').call(d3.axisLeft(y))

		// Show the main vertical line
		svg
			.selectAll('vertLines')
			.data(sumstat)
			.enter()
			.append('line')
			.attr('x1', function (d) {
				return x(d.key)
			})
			.attr('x2', function (d) {
				return x(d.key)
			})
			.attr('y1', function (d) {
				return y(d.value.min)
			})
			.attr('y2', function (d) {
				return y(d.value.max)
			})
			.attr('stroke', 'black')
			.style('width', 40)

		// rectangle for the main box
		var boxWidth = 100
		svg
			.selectAll('boxes')
			.data(sumstat)
			.enter()
			.append('rect')
			.attr('x', function (d) {
				return x(d.key) - boxWidth / 2
			})
			.attr('y', function (d) {
				return y(d.value.q3)
			})
			.attr('height', function (d) {
				return y(d.value.q1) - y(d.value.q3)
			})
			.attr('width', boxWidth)
			.attr('stroke', 'black')
			.style('fill', '#69b3a2')

		// Show the median
		svg
			.selectAll('medianLines')
			.data(sumstat)
			.enter()
			.append('line')
			.attr('x1', function (d) {
				return x(d.key) - boxWidth / 2
			})
			.attr('x2', function (d) {
				return x(d.key) + boxWidth / 2
			})
			.attr('y1', function (d) {
				return y(d.value.median)
			})
			.attr('y2', function (d) {
				return y(d.value.median)
			})
			.attr('stroke', 'black')
			.style('width', 80)

		// Add individual points with jitter
		var jitterWidth = 50
		svg
			.selectAll('indPoints')
			.data(props.cancerData.data)
			.enter()
			.append('circle')
			.attr('cx', function (d) {
				return x(d.gender) - jitterWidth / 2 + Math.random() * jitterWidth
			})
			.attr('cy', function (d) {
				return y(d.gene_value)
			})
			.attr('r', 4)
			.style('fill', 'white')
			.attr('stroke', 'black')
	}

	useEffect(() => {
		buildPlot()
	}, [])

	return (
		<CollapsableCard title='Box Plot'>
			<Wrapper>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='16'
					height='16'
					fill='currentColor'
					className='bi bi-pin-fill'
					viewBox='0 0 16 16'
				>
					<path d='M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354z' />
				</svg>
			</Wrapper>
			<div>
				<Trigger>Click to download</Trigger>
			</div>
		</CollapsableCard>
	)
}
