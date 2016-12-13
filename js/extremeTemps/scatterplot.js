
var margin = {top: 10, right: 60, bottom: 20, left: 40};

var width = 660 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var svg = d3.select("#highsAndLows").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set up axes
var y = d3.scale.linear()
    .range([height, 0]);

var x = d3.time.scale()
    .range([0, width]);


var xAxis = d3.svg.axis()
    .orient("down");

svg.append("g")
    .attr("class", "axis x-axis")
    .call(xAxis);

var yAxis = d3.svg.axis()
    .orient("left");

svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);


var timeline = svg
    .append("line")
    .attr("class", "timeline");

timeline
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "gray")
    .attr("stroke-width", 2);




var recordsPlot = d3.svg.line();

function initializeScatterPlot() {
    x.domain([formatDate.parse('1820'), formatDate.parse('2012')]);

    y.domain([d3.min(lowTemps, function(data){
        return data.Low;
    }), d3.max(highTemps, function(data){
        return data.High;
    })]);

    // axes
    xAxis = d3.svg.axis().scale(x).orient("down")
        .ticks(4);


    svg.selectAll(".x-axis").transition().call(xAxis).attr("transform", "translate(0, 270)");


    yAxis = d3.svg.axis().scale(y).orient("left");

    svg.selectAll(".y-axis").transition().call(yAxis);

    recordsPlot
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Temperature); });


    var circles = svg.selectAll(".circle").data(recordsData);


    circles
        .enter()
        .append("circle")
        .attr("class", "circle")
        .transition()
        .duration(50)
        .attr("cx", function(data, index){
            // console.log(data.Year)
            // console.log(data.Year.toString().substring(0,4))
            // console.log(x(formatDate.parse(data.Year.toString().substring(0,4))))
            return x(formatDate.parse(data.Year.toString().substring(0,4)));
        })
        .attr("cy", function(data, index){
            return y(data.Temperature)
        })
        .attr("r", 2)
        .attr("visibility", function(d){
            if (d.Year <1820){
                return "hidden";
            } else {
                return "visible";
            }
        })
        .attr("fill", "lightgray");

    updateYear();
}

function updateYear(){
    var value = slider.value();
    var ranged = x(formatDate.parse(value.toString().substring(0,4)))
    timeline.attr("x1", ranged)
        .attr("x2", ranged);


    var filteredData = recordsData.filter(function(d){
        return d.Year == value;
    })

    svg.selectAll(".current").remove();

    var current = svg.selectAll(".current").data(filteredData);

    current
        .enter()
        .append("circle")
        .attr("class", "current")
        .attr("cx", function(data, index){
            return x(formatDate.parse(data.Year.toString().substring(0,4)));
        })
        .attr("cy", function(data, index){
            return y(data.Temperature)
        })
        .attr("r", 3)
        .attr("fill", "red");

    current.exit().remove()
}



var highline = d3.svg.line();

var lowline = d3.svg.line();
var highpath = svg.append("path");
var lowpath = svg.append("path");


function updateMinMax() {
    // console.log(highTemps);

    // set scales
    x.domain([formatDate.parse('1820'), formatDate.parse('2012')]);
    // x.tickFormat(d3.time.format("%Y"))

    y.domain([d3.min(lowTemps, function(data){
        return data.Low;
    }), d3.max(highTemps, function(data){
        return data.High;
    })]);

    // axes
    xAxis = d3.svg.axis().scale(x).orient("down")
        .ticks(4);


    svg.selectAll(".x-axis").transition().call(xAxis).attr("transform", "translate(0, 285)");


    yAxis = d3.svg.axis().scale(y).orient("left");

    svg.selectAll(".y-axis").transition().call(yAxis);



    // line
    highline
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.High); });


    lowline
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Low); });


    highpath
        .datum(highTemps)
        .transition()
        .duration(1000)
        .attr("class", "line")
        .attr("d", highline)
        .attr("fill", "none");

    lowpath
        .datum(lowTemps)
        .transition()
        .duration(1000)
        .attr("class", "line")
        .attr("d", lowline)
        .attr("fill", "none");

    var highs = svg.selectAll(".circle").data(highTemps);


    var lows = svg.selectAll(".circle").data(lowTemps);

    highs
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("fill", "red");

    highs
        .transition()
        .duration(1000)
        .attr("cx", function(data, index){
            return x(data.Year);
        })
        .attr("cy", function(data, index){
            return y(data.High)
        })
        .attr("r", 2);

    lows
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("fill", "gray");

    lows
        .transition()
        .duration(1000)
        .attr("cx", function(data, index){
            return x(data.Year);
        })
        .attr("cy", function(data, index){
            return y(data.Low)
        })
        .attr("r", 2);


    highs.exit().remove();
    lows.exit().remove();

}
