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

    vis.margin = {top: 50, right: 50, bottom: 50, left: 50};
    vis.width = 2000 - vis.margin.left - vis.margin.right;
    vis.height = 2000 - vis.margin.top - vis.margin.bottom;


    vis.senHeight = 25;
    vis.senWidth = 50;
    vis.senPadding = 3;

    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.svg.append("text")
        .text("Climate Deniers")
        // .attr("text-anchor","middle")
        .attr("y",0)
        .attr("x",vis.width * 3 / 4 - 50);

    vis.svg.append("text")
        .text("Climate Champions")
        // .attr("text-anchor","middle")
        .attr("y",0)
        .attr("x",vis.width / 4);

    vis.svg.append("line")
        .attr("y1", 0)
        .attr("y2", 8*vis.senHeight)
        .attr("x1", vis.width/2 + 25)
        .attr("x2", vis.width/2 + 25)
        .attr("stroke","black")
        .attr("stroke-weight",2);


    vis.wrangleData();
};

CongressVis.prototype.wrangleData = function() {
    var vis = this;

    vis.sortParam = d3.select(".form-control").property("value")

    vis.data = vis.data.sort(function(a, b) {
        return compareStrings(a.Senator, b.Senator);
    });

    if (vis.sortParam != "Senator") {
        vis.data = vis.data.sort(function(a, b) {
            return compareStrings(a.State, b.State);
        });
        if (vis.sortParam != "State") {
            vis.data = vis.data.sort(function(a, b) {
                return b[vis.sortParam] - a[vis.sortParam];
            });

        }
    }

    vis.believe = vis.data.filter(function(d) { return d.BelieveClimateChange == "Yes" });
    vis.deny = vis.data.filter(function(d) { return d.BelieveClimateChange == "No" });



    vis.updateVis();

};

CongressVis.prototype.updateVis = function() {
    var vis = this;

    vis.tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
        return d.Senator + ", " + d.State + ", " + vis.sortParam + ": " + d[vis.sortParam];
    });

    vis.senBelieveIcons = vis.svg.selectAll(".senBelieveIcons")
        .data(vis.believe);

    // Add
    vis.senBelieveIcons.enter().append("rect")
        .attr("class", "senBelieveIcons");


    var yholder = -1
    // Update
    vis.senBelieveIcons
        .attr("x", function(d,index) {
            // Some complicated function
            return vis.width/2 - 30 - (index % 10) * (vis.senWidth + vis.senPadding);
        })
        .attr("width", vis.senWidth)
        .attr("y", function(d,index) {
            // Some complicated function
            if (index % 20 == 0) {
                yholder++;
            }
            return 5 + yholder * (vis.senHeight + vis.senPadding);
        })
        .attr("height", vis.senHeight)
        .attr("fill", function (d) {
            if (d.Party == "Republican") {
                return "red";
            } else {
                return "blue";
            }
        })
        .on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);

    // Remove
    vis.senBelieveIcons.exit().remove();

    // Invoke tooltip
    vis.senBelieveIcons.call(vis.tip)

    vis.senDenyIcons = vis.svg.selectAll(".senDenyIcons")
        .data(vis.deny);

    // Add
    vis.senDenyIcons.enter().append("rect")
        .attr("class", "senDenyIcons");


    yholder = -1
    // Update
    vis.senDenyIcons
        .attr("x", function(d,index) {
            // Some complicated function
            return 30 + vis.width/2 + (index % 10) * (vis.senWidth + vis.senPadding);
        })
        .attr("width", vis.senWidth)
        .attr("y", function(d,index) {
            // Some complicated function
            if (index % 20 == 0) {
                yholder++;
            }
            return 5 + yholder * (vis.senHeight + vis.senPadding);
        })
        .attr("height", vis.senHeight)
        .attr("fill", function (d) {
            if (d.Party == "Republican") {
                return "red";
            } else {
                return "blue";
            }
        })
        .on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);

    // Remove
    vis.senDenyIcons.exit().remove();

    // Invoke tooltip
    vis.senDenyIcons.call(vis.tip)


    d3.select(".form-control")
        .on("change", function() {
            console.log("hi")
            vis.wrangleData();
        });


    console.log(vis.believe);
    console.log(vis.deny)
    console.log(yholder)
};

function compareStrings(a, b) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
}
