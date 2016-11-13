
// SVG drawing area

var margin = {top: 10, right: 10, bottom: 10, left: 10};

var width = 400 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var svg = d3.select("#map").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
    .range([width, 0]);

var y = d3.scale.linear()
    .range([height, 0]);

loadData();

var data;

// Load CSV file
function loadData() {

    d3.csv("data/testislandxy.csv", function(error, csv) {

        csv.forEach(function(d){
            d.x = +d.x;
            d.y = +d.y;
            d.altitude = +d.altitude;
        });

        data = csv;

        // Draw the visualization for the first time
        updateVisualization();
    });

}

function updateVisualization() {

    data = data.sort(function(a,b) {
        return a.altitude - b.altitude;
    });

    x.domain(d3.extent(data, function(d) { return d.x; }));
    y.domain(d3.extent(data, function(d) { return d.y; }));

    var circs = svg.selectAll("circle")
        .data(data);

    circs.enter()
        .append("circle");

    circs.attr("class", "country-circ")
        .attr("fill", function(d) {
            if(d.altitude > +(d3.select(".form-control").property("value"))) { return "tan"; }
            else { return "blue"; }
        })
        .attr("cx", function(d) {
            return x(d.x);
        })
        .attr("cy", function(d) {
            return y(d.y);
        })
        .attr("r", 5);

    // Exit
    circs.exit().remove();
    console.log("check")
}

d3.select(".form-control")
    .on("change", function() {
        updateVisualization();
    });
