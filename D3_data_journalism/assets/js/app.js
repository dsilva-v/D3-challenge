// svg container
var svgHeight = 800
var svgWidth = 1000

// set the margins
var margins = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
}

// calculate the chart's height and width
var chartWidth = svgWidth - margins.left - margins.right
var chartHeight = svgHeight - margins.top - margins.bottom

// Add your svg to the div
var svg = d3
  .select('#scatter')
  .append('svg')
  .attr('height', svgHeight)
  .attr('width', svgWidth)

// append g to svg and transform margins
var chartGroup = svg
  .append('g')
  .attr('transform', `translate(${margins.left},${margins.top})`)

// Load csv data
d3.csv('./assets/data/data.csv').then(function (healthData) {
  // variables to hold individual data
  var poverty = healthData.map(data => data.poverty)
  var healthcare = healthData.map(data => data.healthcare)

  // get the min and max for the values
  var xDiff = Math.max.apply(null, poverty) - Math.min.apply(null, poverty)
  var yDiff =
    Math.max.apply(null, healthcare) - Math.min.apply(null, healthcare)

  // scale the axes
  var xAxisScale = d3
    .scaleLinear()
    .domain([
      Math.min.apply(null, poverty) - 0.5 * xDiff,
      Math.max.apply(null, poverty) + 0.5 * xDiff
    ])
    .range([0, chartWidth])
  var yAxisScale = d3
    .scaleLinear()
    .domain([
      Math.min.apply(null, healthcare) - 0.5 * yDiff,
      Math.max.apply(null, healthcare) + 0.5 * yDiff
    ])
    .range([chartHeight, 0])

  // create and append axes
  var xAxis = d3.axisBottom(xAxisScale)
  var yAxis = d3.axisLeft(yAxisScale)

  chartGroup
    .append('g')
    .attr('transform', `translate(0,${chartHeight})`)
    .call(xAxis)

  chartGroup.append('g').call(yAxis)

  // Add titles to the axes
  chartGroup
    .append('text')
    .attr('x', -300)
    .attr('y', -25)
    .attr('transform', 'rotate(-90)')
    .text('Lacks Healthcare in %')

  chartGroup
    .append('text')
    .attr('transform', `translate(${chartWidth / 2},${chartHeight + 30})`)
    .attr('class', 'axisText')
    .style('text-anchor', 'middle')
    .text('Poverty in %')

  // Add Circles
  var circles = chartGroup
    .append('g')
    .selectAll('dot')
    .data(healthData)
    .enter()
    .append('circle')
    .attr('cx', d => xAxisScale(d.poverty))
    .attr('cy', d => yAxisScale(d.healthcare))
    .attr('r', 12)
    .attr('fill', '#69b3a2')
    .attr('text', d => d.abbr)

  // Add labels to circles
  var labels = chartGroup
    .selectAll(null)
    .data(healthData)
    .enter()
    .append('text')
    .attr('dx', d => xAxisScale(d.poverty) - 2)
    .attr('dy', d => yAxisScale(d.healthcare))
    .text(d => d.abbr)
    .attr('font-family', 'sans-serif')
    .attr('font-size', '8px')
    .attr('fill', 'white')
})
