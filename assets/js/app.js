// Create height and width variables for SVG object
var svgWidth = 960;
var svgHeight = 500;

// Create margin for SVG
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

//Create height and width variables for chart area of SVG
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial x-axis
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(stateData) {
    

    //Parse data
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d.healthcare)-2, d3.max(stateData, d => d.healthcare)+2])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

    // append initial circles 
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .classed('stateCircle', true)
    .attr("opacity", ".5");

    // Append text group to circles
    var textGroup = chartGroup.selectAll()
    .data(stateData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .classed("stateText", true)
    .style("font-size","12px")
    .style("font-weight","bold")
    .text(d => d.abbr);

     // append y axis
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .classed("aText", true)
  .text("Lacks Healthcare (%)");

    // Append x axis
  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + 20})`)
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty")
  .classed("aText", true)
  .text("In Poverty (%)");

});