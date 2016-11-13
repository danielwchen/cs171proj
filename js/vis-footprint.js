
// SVG drawing area

var margin = {top: 50, right: 50, bottom: 50, left: 50};

var width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

var svg = d3.select("#footprintvis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
    .range([width, 0]);

var y = d3.scale.linear()
    .range([height, 0]);

x.domain([0,100]);
y.domain([0,100]);

var r = d3.scale.linear()
    .range([0,30]);

loadData();

var data;

// Load CSV file
function loadData() {

    d3.csv("data/footprint.csv", function(error, csv) {

        csv.forEach(function(d){
            d.footprintallGHGpercapita = +d.footprintallGHGpercapita;
            d.CH4percapita = +d.CH4percapita;
            d.footprintallGHG = +d.footprintallGHG;
        });

        data = csv;

        // Draw the visualization for the first time
        updateVisualization();
    });

}

function updateVisualization() {

    data = data.sort(function(a,b) {
        return b.footprintallGHGpercapita - a.footprintallGHGpercapita;
    });


    r.domain(d3.extent(data, function(d) { return d.footprintallGHGpercapita; }));


    var circs = svg.selectAll("circle")
        .data(data);

    circs.enter()
        .append("circle");

    circs.attr("class", "country-circ")
        .attr("fill", function(d) {
            return "blue";
        })
        .attr("cx", function(d,index) {
            return x(index * 9);
        })
        .attr("cy", function(d,index) {
            return y(index * 9);
        })
        .attr("r", function(d) {return r(d.footprintallGHGpercapita)});

    // Exit
    circs.exit().remove();
    console.log("check")
}
//
// d3.select(".form-control")
//     .on("change", function() {
//         updateVisualization();
//     });
