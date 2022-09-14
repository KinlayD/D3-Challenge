// conda activate bootcamp -> python -m http.server

// define the svg area dimensions
var svgWidthScatter = 960;
var svgHeightScatter = 500;

// define the chart's margins
var chartMarginScatter = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// define the chart area within the svg element, minus the margins
var chartWidthScatter = svgWidthScatter - chartMarginScatter.left - chartMarginScatter.right;
var chartHeightScatter = svgHeightScatter - chartMarginScatter.top - chartMarginScatter.bottom;

// svg element
var svgElementScatter = d3.select("#scatter").append("svg")
  .attr("width", svgWidthScatter)
  .attr("height", svgHeightScatter)
  .attr("class", "chart");

// Chart group element 
var chartGroupScatter = svgElementScatter.append("g")
  .attr("transform", `translate(${chartMarginScatter.left}, ${chartMarginScatter.top})`);

// Parse data
d3.csv("data/data.csv").then(function(data) {
    data.forEach(function(element) {
        element.healthcare = +element.healthcare;
        element.poverty = +element.poverty;
    });

    // configure x scale function
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data, element => element.poverty)])
        .range([0, chartWidthScatter]);

    // configure y scale function
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, element => element.healthcare)])
        .range([chartHeightScatter, 0]);
    
    // configure x axis function
    var xAxis = d3.axisBottom(xScale);

    // configure y axis function
    var yAxis = d3.axisLeft(yScale);
    
    // append x axis to the chart group
    chartGroupScatter.append("g")
        .attr("transform", `translate(0 ${chartHeightScatter})`)
        .call(xAxis);

    // append y axis to the chart group
    chartGroupScatter.append("g")
        .call(yAxis);
    
    // append circles to chart group
    var circlesGroup = chartGroupScatter.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", element => xScale(element.poverty))
        .attr("cy", element => yScale(element.healthcare))
        .attr("class", "stateCircle")
        .attr("r", "10");
    
    // append text to circles
    circlesGroup.append("text")
        .text(function(element) {return (element.abbr)})
        .attr("class", "stateText");



    }).catch(function(error) {
        console.log(error);
});
