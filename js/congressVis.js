/*
 *  CongressVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

CongressVis = function(_parentElement, _data, _eventHandler) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;

    this.initVis();
};

CongressVis.prototype.initVis = function() {

    var vis = this;

    vis.margin = {top: 30, right: 10, bottom: 0, left: 10};
    vis.width = 900 - vis.margin.left - vis.margin.right;
    vis.height = 700 - vis.margin.top - vis.margin.bottom;

    vis.z = d3.scale
    vis.x = d3.scale.linear()
        .range([vis.margin.left,vis.width+vis.margin.left])
        .domain([0,vis.width]);

    vis.y = d3.scale.linear()
        .range([0,vis.height])
        .domain([0,vis.height]);


    vis.senHeight = 10;
    vis.senWidth = 20;
    vis.senPadding = 2;

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
        .attr("y1", vis.y(0))
        .attr("y2", vis.y(8*vis.senHeight))
        .attr("x1", vis.x(vis.width/2))
        .attr("x2", vis.x(vis.width/2))
        .attr("stroke","black")
        .attr("stroke-weight",2);

    vis.resetCounters();
    vis.wrangleData();
};


CongressVis.prototype.resetCounters = function() {

    var vis = this;

    vis.spaceBetween = 30;
    vis.numPerRow = 20;

    vis.bCounters = {};
    vis.dCounters = {};

    vis.allCounters = {"bCounters":vis.bCounters, "dCounters":vis.dCounters};
    vis.allCounters.bCounters['ageNow'] = {range3039:0, range4049:0, range5059:0, range6069:0, range7079:0, range8089:0, rowsPerSection:Math.ceil(38/vis.numPerRow)};
    vis.allCounters.bCounters['ageInOffice'] = {range3039:0, range4049:0, range5059:0, range6069:0, rowsPerSection:Math.ceil(40/vis.numPerRow)};
    vis.allCounters.bCounters['yearsInOffice'] = {range09:0, range1019:0, range2029:0, range3039:0, range4049:0, rowsPerSection:Math.ceil(23/vis.numPerRow)};;
    vis.allCounters.bCounters['yearNextElection'] = {"2018":0, "2020":0, "2022":0, rowsPerSection:Math.ceil(33/vis.numPerRow)};
    vis.allCounters.bCounters['party'] = {democratic:0, republican:0, independent:0, rowsPerSection:Math.ceil(51/vis.numPerRow)};

    vis.allCounters.dCounters['ageNow'] = {range3039:0, range4049:0, range5059:0, range6069:0, range7079:0, range8089:0, rowsPerSection:Math.ceil(38/vis.numPerRow)};
    vis.allCounters.dCounters['ageInOffice'] = {range3039:0, range4049:0, range5059:0, range6069:0, rowsPerSection:Math.ceil(40/vis.numPerRow)};
    vis.allCounters.dCounters['yearsInOffice'] = {range09:0, range1019:0, range2029:0, range3039:0, range4049:0, rowsPerSection:Math.ceil(23/vis.numPerRow)};;
    vis.allCounters.dCounters['yearNextElection'] = {"2018":0, "2020":0, "2022":0, rowsPerSection:Math.ceil(33/vis.numPerRow)};
    vis.allCounters.dCounters['party'] = {democratic:0, republican:0, independent:0, rowsPerSection:Math.ceil(51/vis.numPerRow)};

    console.log(vis.allCounters);
    // vis.counters.yearNextElection['2020'] += 5;
    // console.log(vis.counters.yearNextElection['2020']);

    // Current Age (6) 30-39 (1) 40-49 (13) 50-59 (25) 60-69 (38) 70-79 (15) 80-89 (7)
    // Age when taking office (4) 30-39 (5) 40-49 (33) 50-59 (40) 60-69 (21)
    // Years in office (5) 0-9 (59) 10-19 (23) 20-29 (10) 30-39 (5) 40-49 (2)
    // Year of next election (3) 2018 (33) 2020 (33) 2022 (33)
    // Party Dem (46) Independent (2) Rep (51)




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
        return d.Party + " Sen " + d.Senator + ", " + d.State + ", " + vis.sortParam + ": " + d[vis.sortParam];
    });

    vis.senBelieveIcons = vis.svg.selectAll(".senBelieveIcons")
        .data(vis.believe, function(d) { return d.Senator });

    // Add
    vis.senBelieveIcons.enter().append("rect")
        .attr("class", "senBelieveIcons")
        .attr("fill", function (d) {
            if (d.Party == "Republican") {
                return "red";
            } else {
                return "blue";
            }
        })
        .attr("width", vis.senWidth);

    var yholder = -1;
    // Update
    vis.senBelieveIcons
        .attr("height", vis.senHeight)
        .transition().duration(1000)
        .attr("x", function(d,index) {
            // Some complicated function
            return vis.width/2 - 30 - (index % 20) * (vis.senWidth + vis.senPadding);
        })
        .attr("y", function(d,index) {
            // Some complicated function
            if (index % 20 == 0) {
                yholder++;
            }
            return 5 + yholder * (vis.senHeight + vis.senPadding);
        });

    vis.senBelieveIcons
        .on('mouseover', vis.tip.show
        // $(vis.eventHandler).trigger("stateOver", d.State);
    )
        .on('mouseout', vis.tip.hide
            // $(vis.eventHandler).trigger("stateOff");
        );

    // Remove
    vis.senBelieveIcons.exit().remove();

    // Invoke tooltip
    vis.senBelieveIcons.call(vis.tip);

    vis.senDenyIcons = vis.svg.selectAll(".senDenyIcons")
        .data(vis.deny, function(d) { return d.Senator });

    // Add
    vis.senDenyIcons.enter().append("rect")
        .attr("class", "senDenyIcons")
        .attr("fill", function (d) {
            if (d.Party == "Republican") {
                return "red";
            } else {
                return "blue";
            }
        })
        .attr("width", vis.senWidth)
        .attr("height", vis.senHeight);


    yholder = -1;
    // Update
    vis.senDenyIcons
        .transition().duration(1000)
        .attr("x", function(d,index) {
            // Some complicated function
            return 30 + vis.width/2 + (index % 20) * (vis.senWidth + vis.senPadding);
        })
        .attr("y", function(d,index) {
            // Some complicated function
            if (index % 20 == 0) {
                yholder++;
            }
            return 5 + yholder * (vis.senHeight + vis.senPadding);
        });

    vis.senDenyIcons
        .on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);

    // Remove
    vis.senDenyIcons.exit().remove();

    // Invoke tooltip
    vis.senDenyIcons.call(vis.tip)


    d3.select(".form-control")
        .on("change", function() {
            vis.wrangleData();
        });
};

function compareStrings(a, b) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
}

CongressVis.prototype.onStateOver = function(state) {
    var vis = this;

    if (state) {
        vis.senBelieveIcons.transition().duration(80)
            .attr("fill",function(d) {
                if(d.State == state) {
                    if (d.Party == "Republican") {return "red"}
                    else {return "blue"}
                } else {
                    if (d.Party == "Republican") {return "#FFCACA"}
                    else {return "#CACAFF"}
                }
            });
        vis.senDenyIcons.transition().duration(80)
            .attr("fill",function(d) {
                if(d.State == state) {
                    if (d.Party == "Republican") {return "red"}
                    else {return "blue"}
                } else {
                    if (d.Party == "Republican") {return "#FFCACA"}
                    else {return "#CACAFF"}
                }
            });
    } else {
        vis.senBelieveIcons.transition().duration(80)
            .attr("fill",function(d) {
                if (d.Party == "Republican") {return "red"}
                else {return "blue"}
            });
        vis.senDenyIcons.transition().duration(80)
            .attr("fill",function(d) {
                if (d.Party == "Republican") {return "red"}
                else {return "blue"}
            });
    }
};

CongressVis.prototype.pinState = function(state) {
    var vis = this;

    if (state) {
        vis.senBelieveIcons.transition().duration(80)
            .attr("fill",function(d) {
                if(d.State == state) {
                    if (d.Party == "Republican") {return "red"}
                    else {return "blue"}
                } else {
                    if (d.Party == "Republican") {return "#FFCACA"}
                    else {return "#CACAFF"}
                }
            });
        vis.senDenyIcons.transition().duration(80)
            .attr("fill",function(d) {
                if(d.State == state) {
                    if (d.Party == "Republican") {return "red"}
                    else {return "blue"}
                } else {
                    if (d.Party == "Republican") {return "#FFCACA"}
                    else {return "#CACAFF"}
                }
            });
    } else {
        vis.senBelieveIcons.transition().duration(80)
            .attr("fill",function(d) {
                if (d.Party == "Republican") {return "red"}
                else {return "blue"}
            });
        vis.senDenyIcons.transition().duration(80)
            .attr("fill",function(d) {
                if (d.Party == "Republican") {return "red"}
                else {return "blue"}
            });
    }
};