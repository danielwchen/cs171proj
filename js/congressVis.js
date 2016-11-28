/**
 * Created by Daniel on 11/26/16.
 */

var marriages = [[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0],
    [0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
    [1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,0,0,0,0,0,1,0,1,0,0,0],
    [0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0]];
var businessties = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,1,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0],
    [0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,1,0,0,0,1,0,0,0,0,0],
    [0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0]];

var nullData = [{thing: "thing"}];
var displayData;
var sortedData;

var cellHeight = 20, cellWidth = 20, cellPadding = 10;

var margin = {top: 70, right: 0, bottom: 0, left: 100};
// Width and height as the inner dimensions of the chart area
var width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("#vis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var keysvg = d3.select("#key").append("svg")
    .attr("width", 400)
    .attr("height", 50)
    .append("g");

keysvg.append("path")
    .attr("d", 'M 30 10 l 20 0 l 0 20 z')
    .attr("fill", "purple");

keysvg.append("path")
    .attr("d", 'M 170 10 l 0 20 l 20 0 z')
    .attr("fill", "orange");

keysvg.append("text")
    .text("Marriage")
    .attr("x", "55")
    .attr("y", "25");

keysvg.append("text")
    .text("Business Tie")
    .attr("x", "195")
    .attr("y", "25");

var rows = [];
for(var i = 0; i < 16; i++) {
    rows[i] = svg.append("g")
        .attr("transform", "translate(0,"+i*(cellHeight + cellPadding)+")");
}

queue()
    .defer(d3.csv, "data/florentine-familiy-attributes.csv")
    .await(function(error, families){

        // --> PROCESS DATA
        families.forEach(function(d,index) {
            families[index].businessValues = businessties[index];
            families[index].marriageValues = marriages[index];
            families[index].businessCount = businessties[index].reduce(function(a, b) { return a + b; }, 0);
            families[index].marriageCount = marriages[index].reduce(function(a, b) { return a + b; }, 0);
            families[index].relationsCount = families[index].businessCount + families[index].marriageCount;
        });
        displayData = families;

        wrangleData();
    });

function wrangleData() {
    var input = d3.select(".form-control").property("value");
    sortedData = JSON.parse(JSON.stringify(displayData));;
    if(input == "default") {
    } else {
        sortedData.sort(function(a,b) {
            return b[input] - a[input];
        });
    }

    sortedData.forEach(function(d,index) {
        displayData.forEach(function(d2,index2) {
            if (d.Family == d2.Family) {
                displayData[index2].index = index;
            }
        });
    });

    createVis();
}

function createVis() {

    var colLabel = svg.selectAll("text")
        .data(displayData);

    colLabel.enter().append("text")
        .attr("class","col-label")
        .text(function(d) {return d.Family})
        .attr("text-anchor","start")
        .attr("transform","rotate(-90)")
        .attr("y", function(d,index) {return (cellWidth + cellPadding) * index + 15;})
        .attr("x", 5);

    for(var i = 0; i < 16; i++) {
        var rowLabel = rows[i].selectAll("text")
            .data(nullData);

        rowLabel.enter().append("text")
            .attr("class","row-label")
            .text(displayData[i].Family)
            .attr("text-anchor","end")
            .attr("y", 15)
            .attr("x", -5);

        var upperTrianglePath = rows[i].selectAll(".upper-triangle")
            .data(displayData[i].marriageValues);

        upperTrianglePath.enter().append("path")
            .attr("class", "upper-triangle");

        upperTrianglePath
            .attr("d", function (d, index) {
                // Shift the triangles on the x-axis (columns)
                var x = (cellWidth + cellPadding) * index;

                // All triangles of the same row have the same y-coordinates
                // Vertical shifting is already done by transforming the group elements
                var y = 0;

                return 'M ' + x + ' ' + y + ' l ' + cellWidth + ' 0 l 0 ' + cellHeight + ' z';
            })
            .attr("fill", function (d, index) {
                if (d == 1) {
                    return "purple"
                } else {
                    return "lightgray"
                }
            });

        // D3's enter, update, exit pattern
        var lowerTrianglePath = rows[i].selectAll(".lower-triangle")
            .data(displayData[i].businessValues);

        lowerTrianglePath.enter().append("path")
            .attr("class", "lower-triangle");

        lowerTrianglePath
            .attr("d", function (d, index) {
                // Shift the triangles on the x-axis (columns)
                var x = (cellWidth + cellPadding) * index;

                // All triangles of the same row have the same y-coordinates
                // Vertical shifting is already done by transforming the group elements
                var y = 0;

                return 'M ' + x + ' ' + y + ' l 0 ' + cellHeight + ' l ' + cellWidth + ' 0 z';
            })
            .attr("fill", function (d, index) {
                if (d == 1) {
                    return "orange"
                } else {
                    return "lightgray"
                }
            });

        console.log(sortedData[i].index*(cellHeight + cellPadding))
        rows[i].transition().duration(800).attr("transform","translate(0,"+displayData[i].index*(cellHeight + cellPadding) + ")");
    }

}


d3.select(".form-control")
    .on("change", function() {
        wrangleData();
    });
