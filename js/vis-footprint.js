
// SVG drawing area

var margin = {top: 50, right: 50, bottom: 50, left: 50};

var width = 900 - margin.left - margin.right,
    height = 5900 - margin.top - margin.bottom;

var svg = d3.select("#footprint-vis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgSide = d3.select("#avg-footprint").append("svg")
    .attr("width", 200)
    .attr("height", 200);

var r = d3.scale.linear()
    .range([1,200]);

var yPlaceholder = 0;

loadData();

var data;

// Load CSV file
function loadData() {

    d3.csv("data/carbonByCountry.csv", function(error, csv) {

        csv.forEach(function(d){
            d.Total = +d.Total;
            d.PC = +d.PC;
        });

        data = csv;

        // Draw the visualization for the first time
        updateVisualization();
    });

}

function updateVisualization() {

    data = data.sort(function(a,b) {
        return getData(b) - getData(a);
    });



    yPlaceholder = 0;

    console.log(data);

    r.domain(d3.extent(data, function(d){return getData(d);}));

    var circs = svg.selectAll("circle")
        .data(data);

    var markers = svg.selectAll("path")
        .data(data);

    circs.enter()
        .append("circle");

    markers.enter()
        .append("path");

    var tip = d3.tip().attr('class', 'd3-tip').offset([-10,0]).html(function(d) {
        return d.Country + " " + getData(d);
    });

    svg.call(tip);

    circs
        .attr("class", "country-circ")
        .attr("fill", function(d) {
            return "blue";
        })
        .attr("cx", function(d) {
            return width - 200;
        })
        .attr("cy", function(d) {
            d.yVal = height - yPlaceholder - 20 - r(getData(d));
            yPlaceholder = yPlaceholder + 20 + 2*r(getData(d));
            return d.yVal;
        })
        .attr("r", function(d) {return r(getData(d))})
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide); // Population;

    markers
        .attr("d", function(d, index){
            // Shift the triangles on the x-axis (columns)
            var x = width - 250 - r(getData(d));

            // All triangles of the same row have the same y-coordinates
            // Vertical shifting is already done by transforming the group elements
            var y = d.yVal - 20;

            return 'M ' + x + ' ' + y + ' l 50 20 l -50 20 z';
        })
        .attr("fill", function(d){
            switch(d.Country){
                case "Nauru":
                    return "green";
                case "Nicaragua":
                    return "lime";
                case "United Kingdom":
                    return "yellow";
                case "India":
                    return "orange";
                case "United States":
                    return "red";
                case "China":
                    return "red";
                default:
                    return "none";
            }

        });


    // Exit
    circs.exit().remove();
    markers.exit().remove();
}

function getData(country){
    var input = $('input[name="dataS"]:checked').val();
    return (input == "total") ? country.Total : country.PC;
}