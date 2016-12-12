/*
 *  ElectoralMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

ElectoralMap = function(_parentElement, _data, _eventHandler) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;
    this.pinned = false;

    this.initVis();
};

ElectoralMap.prototype.initVis = function() {

    var vis = this;

    vis.margin = {top: 30, right: 10, bottom: 0, left: 10};
    vis.width = $(vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 300 - vis.margin.top - vis.margin.bottom;


    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height);

    d3.json("data/us-states.json", function(json) {
        vis.json = json;
        vis.wrangleData();
    });

    vis.svg.append("text")
        .text("Hover over your state")
        .attr("text-anchor","middle")
        .attr("y",45)
        .attr("x",200);

    vis.svg.append("text")
        .text("Click to pin")
        .attr("text-anchor","middle")
        .attr("y",60)
        .attr("x",200);
};

ElectoralMap.prototype.wrangleData = function() {
    var vis = this;

    for (var i = 0; i < vis.data.length; i++) {
        for (var j = 0; j < vis.json.features.length; j++) {
            if (vis.json.features[j].properties.name == vis.data[i].State) {
                vis.json.features[j].properties.senDeniers = vis.data[i].senDeniers;
                break;
            }
        }
    }


    // vis.displayData = vis.data;

    // Update the visualization
    vis.updateVis();

};

ElectoralMap.prototype.updateVis = function() {
    var vis = this;

    vis.projection = d3.geo.albersUsa()
        .translate([vis.width / 2, vis.height / 2])
        .scale([350]);

    vis.path = d3.geo.path()
        .projection(vis.projection);

    // Render the U.S. by using the path generator
    vis.svg.selectAll("path")
        .data(vis.json.features)
        .enter().append("path")
        .attr("d", vis.path)
        .attr("stroke","white")
        .attr("fill",function(d) {
            if (d.properties.senDeniers == 2) {return "red"}
            else if (d.properties.senDeniers == 1) {return "purple"}
            else {return "blue"}
        })
        .on("mouseover",function(d) {
            if (vis.pinned == true) {

            } else {
                $(vis.eventHandler).trigger("stateOver", d.properties.name);
            }
        })
        .on("mouseout",function(d) {
            if (vis.pinned == true) {

            } else {
                $(vis.eventHandler).trigger("stateOff");
            }
        })
        .on("click",function(d) {
            if (vis.pinned == true) {
                $(vis.eventHandler).trigger("unpress");
                vis.pinned = false;
            } else {
                $(vis.eventHandler).trigger("press", d.properties.name);
                vis.pinned = true;
            }
        });



};

ElectoralMap.prototype.onStateOver = function(state) {
    var vis = this;

    if (state) {
        vis.svg.selectAll("path")
            .data(vis.json.features).transition().duration(80)
            .attr("fill",function(d) {
            if(d.properties.name == state) {
                if (d.properties.senDeniers == 2) {return "red"}
                else if (d.properties.senDeniers == 1) {return "purple"}
                else {return "blue"}
            } else {
                if (d.properties.senDeniers == 2) {return "#FF6464"}
                else if (d.properties.senDeniers == 1) {return "#BB88B2"}
                else {return "#6464FF"}
            }
        })
    } else {
        vis.svg.selectAll("path")
            .data(vis.json.features).transition().duration(80)
            .attr("fill",function(d) {
                if (d.properties.senDeniers == 2) {return "red"}
                else if (d.properties.senDeniers == 1) {return "purple"}
                else {return "blue"}
            })
    }
};

ElectoralMap.prototype.pinState = function(state) {
    var vis = this;

    if (state) {
        vis.svg.selectAll("path")
            .data(vis.json.features).transition().duration(80)
            .attr("fill",function(d) {
                if(d.properties.name == state) {
                    if (d.properties.senDeniers == 2) {return "red"}
                    else if (d.properties.senDeniers == 1) {return "purple"}
                    else {return "blue"}
                } else {
                    if (d.properties.senDeniers == 2) {return "#FF6464"}
                    else if (d.properties.senDeniers == 1) {return "#BB88B2"}
                    else {return "#6464FF"}
                }
            })
    } else {
        vis.svg.selectAll("path")
            .data(vis.json.features).transition().duration(80)
            .attr("fill",function(d) {
                if (d.properties.senDeniers == 2) {return "red"}
                else if (d.properties.senDeniers == 1) {return "purple"}
                else {return "blue"}
            })
    }
};