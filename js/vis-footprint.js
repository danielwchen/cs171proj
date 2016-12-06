
// SVG drawing area

var margin = {top: 50, right: 50, bottom: 50, left: 50};

var width = 800 - margin.left - margin.right,
    height = 14600 - margin.top - margin.bottom;

var svg = d3.select("#footprint-vis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var svgSide = d3.select("#avg-footprint").append("svg")
    .attr("width", 300)
    .attr("height", 370);

var r = d3.scale.linear()
    .range([3,200]);

var yPlaceholder = 0;

loadData();

var data;

// Load CSV file
function loadData() {

    d3.csv("data/carbonByCountry.csv", function(error, csv) {

        csv.forEach(function(d){
            d.Total = +d.Total;
            d.PC = +d.PC;
            d.TotalRadius = Math.sqrt(d.Total)/3.14;
            d.PCRadius = Math.sqrt(d.PC)/3.14;
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

    var extra = ($('input[name="dataS"]:checked').val() == "total") ? 8700 : 0;

    var sum = data.map(function(d){return getData(d);}).reduce(function(a, b){return a + b;},0);
    var avg = sum / data.length;
    var median = getData(data[Math.floor(data.length / 2)]);

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
        return d.Country + " " + getLabelData(d);
    });

    svg.call(tip);

    circs
        .attr("class", "country-circ")
        .attr("fill", function(d) {
            return "black";
        })
        .attr("cx", function(d) {
            return width - 200;
        })
        .attr("cy", function(d) {
            d.yVal = height - yPlaceholder - 20 - r(getData(d)) - extra;
            yPlaceholder = yPlaceholder + 20 + 2*r(getData(d));
            return d.yVal;
        })
        .attr("r", function(d) {return r(getData(d))})
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    markers
        .attr("d", function(d){
            var x = width - 250 - r(getData(d));
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

    svgSide.selectAll("*").remove();

    svgSide
        .append("circle")
            .attr("cx", 75)
            .attr("cy", 300)
            .attr("r", r(avg))
            .attr("fill", "black");
    svgSide
        .append("text")
            .text("mean value (" + Math.round(r(avg), -3) + ")")
            .attr("x", 75)
            .attr("y", 280 - r(avg))
            .attr("text-anchor", "middle");
    svgSide
        .append("circle")
            .attr("cx", 200)
            .attr("cy", 300)
            .attr("r", r(median))
            .attr("fill", "black");
    svgSide
        .append("text")
            .text("median value (" + Math.round(r(median),-3) + ")")
            .attr("x", 200)
            .attr("y", 280 - r(avg))
            .attr("text-anchor", "middle");
}

function getData(country){
    var input = $('input[name="dataS"]:checked').val();
    return (input == "total") ? country.TotalRadius : country.PCRadius;
}

function getLabelData(country){
    var input = $('input[name="dataS"]:checked').val();
    return (input == "total") ? country.Total : country.PC;
}