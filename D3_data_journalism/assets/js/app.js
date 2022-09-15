// conda activate bootcamp -> python -m http.server

// define the svg area dimensions
var svgWidthScatter = 700;
var svgHeightScatter = 600;

// define the chart's margins
var chartMarginScatter = {
  top: 40,
  right: 40,
  bottom: 40,
  left: 40
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
        .domain([d3.min(data, element => element.poverty) - 2, d3.max(data, element => element.poverty) + 2])
        .range([0, chartWidthScatter]);

    // configure y scale function
    var yScale = d3.scaleLinear()
        .domain([d3.min(data, element => element.healthcare) - 2, d3.max(data, element => element.healthcare) + 2])
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
    
    var radius = 10;
    // append circles to chart group
    var circlesGroup = chartGroupScatter.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", element => xScale(element.poverty))
        .attr("cy", element => yScale(element.healthcare))
        .classed("stateCircle", true)
        .attr("r", radius);
    
    var textGroupScatter = chartGroupScatter.append("g");

    textGroupScatter.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(element) {return (element.abbr)})
        .attr("x", element => xScale(element.poverty))
        .attr("y", element => yScale(element.healthcare))
        .attr("font-size", radius / ((radius * 10) / 100))
        .attr("dy", radius / ((radius * 25) / 100))
        .classed("stateText", true);
    
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([40, -60])
        .html(function(element) {
            return (`state: ${element.state}<br> 
            population with no healthcare: ${element.healthcare}%<br>
            population in poverty: ${element.poverty}%`);
        });
    
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(element) {
        toolTip.show(element, this);
    })
    .on("mouseout", function(element) {
        toolTip.hide(element);
    })

    }).catch(function(error) {
        console.log(error);
});
