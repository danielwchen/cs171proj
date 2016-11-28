/*
 *  CongressVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

CongressVis = function(_parentElement, _data) {

    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
};

CongressVis.prototype.initVis = function() {

    var vis = this;

    vis.margin = {top: 70, right: 0, bottom: 0, left: 100};
    vis.width = 600 - vis.margin.left - vis.margin.right;
    vis.height = 1000 - vis.margin.top - vis.margin.bottom;


    vis.senHeight = 25;
    vis.senWidth = 50;
    vis.senPadding = 10;

    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.wrangleData();
};

CongressVis.prototype.wrangleData = function() {
    var vis = this;

    // var input = d3.select(".form-control").property("value");
    // sortedData = JSON.parse(JSON.stringify(displayData));;
    // if(input == "default") {
    // } else {
    //     sortedData.sort(function(a,b) {
    //         return b[input] - a[input];
    //     });
    // }
    //
    // sortedData.forEach(function(d,index) {
    //     displayData.forEach(function(d2,index2) {
    //         if (d.Family == d2.Family) {
    //             displayData[index2].index = index;
    //         }
    //     });
    // });

    vis.data = vis.data.sort(function(a, b) {
        return compareStrings(a.Senator, b.Senator);
    });

    vis.data = vis.data.sort(function(a, b) {
        return compareStrings(a.State, b.State);
    });




    vis.updateVis();

};

CongressVis.prototype.updateVis = function() {
    var vis = this;

    vis.tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
        return d.Senator + ", " + d.State;
    });

    vis.senIcons = vis.svg.selectAll(".senIcons")
        .data(vis.data);

    // Add
    vis.senIcons.enter().append("rect")
        .attr("class", "senIcons");

    // Update
    vis.senIcons
        .attr("x", function(d) {
            // Some complicated function
            return vis.width/2;
        })
        .attr("width", vis.senWidth)
        .attr("y", function(d,index) { return index * (vis.senHeight + vis.senPadding); })
        .attr("height", vis.senHeight)
        .attr("fill", function (d) {
            if (d.BelieveClimateChange == "Yes") {
                return "blue";
            } else {
                return "red";
            }
        })
        .on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);

    // Remove
    vis.senIcons.exit().remove();

    // Invoke tooltip
    vis.senIcons.call(vis.tip)

};

function compareStrings(a, b) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
}

d3.select(".form-control")
    .on("change", function() {
        vis.wrangleData();
    });
