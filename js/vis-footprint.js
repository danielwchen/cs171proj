
// SVG drawing area

var margin = {top: 50, right: 50, bottom: 50, left: 50};

var width = 800 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

var svg = d3.select("#footprintvis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
    .range([width, 0]);

var y = d3.scale.linear()
    .range([0, height]);

x.domain([0,100]);
y.domain([0,100]);

var r = d3.scale.linear()
    .range([5,30]);

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



    var answer = 0;
    var prev = 0;
    var answers = [];
    // svg3.selectAll(".legend-circ")
    //     .data(sizes)
    //     .enter()
    //     .append("circle")
    //     .attr("class","legend-circ")
    //     .attr("fill", "#bdbdbd")
    //     .attr("r", function(d) {
    //         return d.size;
    //     })
    //     .attr("cy", function(d, index) {
    //         answer = (d.size + answer + prev + 5);
    //         prev = d.size;
    //         answers[index] = answer + 40;
    //         return answer + 40;
    //     } )
    //     .attr("cx", width3/2);


    var tip = d3.tip().attr('class', 'd3-tip').offset([-10,0]).html(function(d) {
        return d.country + " " + d.footprintallGHGpercapita;
    });

    svg.call(tip);

    circs.attr("class", "country-circ")
        .attr("fill", function(d) {
            return "blue";
        })
        .attr("cx", function(d,index) {
            return x(index * 9);
        })
        .attr("cy", function(d,index) {
            answer = (d.footprintallGHGpercapita + answer + prev + 5);
            prev = d.footprintallGHGpercapita;
            answers[index] = answer + 40;
            return answer + 40;
        })
        .attr("r", function(d) {return r(d.footprintallGHGpercapita)})
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide); // Population;




    // Exit
    circs.exit().remove();
    console.log("check")
}
//
// d3.select(".form-control")
//     .on("change", function() {
//         updateVisualization();
//     });
