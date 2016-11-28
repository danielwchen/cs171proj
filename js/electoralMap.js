/*
 *  ElectoralMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

ElectoralMap = function(_parentElement, _data, _eventHandler) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;

    this.initVis();
};

ElectoralMap.prototype.initVis = function() {

    var vis = this;

    vis.width = 500;

    vis.height = 300;

    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height);

    d3.json("data/us-states.json", function(json) {
        vis.json = json;
        vis.wrangleData();
    });
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
        .scale([300]);

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
        .on("mouseover",function(d) { console.log (d.properties.name + " " + d.properties.senDeniers)});

};