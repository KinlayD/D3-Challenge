// D3 Dabbler: d3 Assignment

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
    .classed("chart", true);

// chart group element 
var chartGroupScatter = svgElementScatter.append("g")
    .attr("transform", `translate(${chartMarginScatter.left}, ${chartMarginScatter.top})`);

// parse data
d3.csv("data/data.csv").then(function (data) {
    data.forEach(function (element) {
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

    // create tool tips
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([40, -60])
        .html(function (element) {
            return (`state: ${element.state}<br> 
            healthcare: ${element.healthcare}%<br>
            poverty: ${element.poverty}%`);
        });

    // create a group element for circles
    var circlesGroup = chartGroupScatter.selectAll("g").data(data).enter();
    
    // create a variable that stores the radius of circles
    var radius = 10;

    // append circles 
    circlesGroup.append("circle")
        .attr("cx", element => xScale(element.poverty))
        .attr("cy", element => yScale(element.healthcare))
        .classed("stateCircle", true)
        .attr("r", radius)

        // pipe the tool tip event listener to circle elements
        .on("mouseover", function (element) {
            toolTip.show(element, this);
        })
        .on("mouseout", function (element) {
            toolTip.hide(element);
        });

    // append text to circles
    circlesGroup.append("text")
        .text(function (element) { return (element.abbr) })
        .attr("x", element => xScale(element.poverty))
        .attr("y", element => yScale(element.healthcare))
        .attr("font-size", radius / ((radius * 10) / 100))
        .attr("dy", radius / ((radius * 25) / 100))
        .classed("stateText", true)

        // pipe the tool tip event listener to text elements
        .on("mouseover", function (element) {
            toolTip.show(element, this);
        })
        .on("mouseout", function (element) {
            toolTip.hide(element);
        })
    
    // append y axis label
    chartGroupScatter.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (chartHeightScatter / 2))
        .attr("y", chartMarginScatter.left - 67)
        .classed("aText", true)
        .text("(%) of Population without Healthcare");
    
    // append x axis label
    chartGroupScatter.append("text")
        .attr("transform", `translate(${chartWidthScatter / 2}, ${chartHeightScatter + 35})`)
        .classed("aText", true)
        .text("(%) of Population in Poverty");
    
    // trigger tool tips 
    chartGroupScatter.call(toolTip);


}).catch(function (error) {
    console.log(error);
});
