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

    vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
    vis.width = $(vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 220 - vis.margin.top - vis.margin.bottom;


    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");;

    d3.json("data/us-states.json", function(json) {
        vis.json = json;
        vis.wrangleData();
    });

    vis.svg.append("text")
        .text("Hover to see connections")
        .attr("class","note")
        .attr("text-anchor","middle")
        .attr("y",180)
        .attr("x",200);

    vis.svg.append("text")
        .text("Click to pin")
        .attr("class","note")
        .attr("text-anchor","middle")
        .attr("y",195)
        .attr("x",200);
};

ElectoralMap.prototype.wrangleData = function() {
    var vis = this;


    for (var j = 0; j < vis.json.features.length; j++) {
        if (vis.data[vis.json.features[j].properties.name]){
            vis.json.features[j].properties.prop = vis.data[vis.json.features[j].properties.name].prop;
        }
    }

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
            if (d.properties.prop < .2) {return "#feedde"}
            else if (d.properties.prop < .4) {return "#fdbe85"}
            else if (d.properties.prop < .6) {return "#fd8d3c"}
            else if (d.properties.prop < .8) {return "#e6550d"}
            else {return "#a63603"}
        })

        .on("mouseover",function(d) {
            $(vis.eventHandler).trigger("stateOver", d.properties.name);
        })
        .on("mouseout",function(d) {
            $(vis.eventHandler).trigger("stateOff");
        })
        .on("click",function(d) {
            $(vis.eventHandler).trigger("press", d.properties.name);
        });



};

ElectoralMap.prototype.highlightState = function(state) {
    var vis = this;

    if (state) {
        vis.svg.selectAll("path")
            .data(vis.json.features).transition().duration(80)
            .style("opacity",function(d) {
                if(d.properties.name == state) {
                    return 1;
                } else {
                    return .3
                }
            });
            // .attr("fill",function(d) {
            // if(d.properties.name == state) {
            //     if (d.properties.prop < .2) {return "#feedde"}
            //     else if (d.properties.prop < .4) {return "#fdbe85"}
            //     else if (d.properties.prop < .6) {return "#fd8d3c"}
            //     else if (d.properties.prop < .8) {return "#e6550d"}
            //     else {return "#a63603"}
            // } else {
            //     if (d.properties.prop < .2) {return "#feedde"}
            //     else if (d.properties.prop < .4) {return "#fdbe85"}
            //     else if (d.properties.prop < .6) {return "#fd8d3c"}
            //     else if (d.properties.prop < .8) {return "#e6550d"}
            //     else {return "#a63603"}
            // }
        // })
    } else {
        vis.svg.selectAll("path")
            .data(vis.json.features).transition().duration(80)
            .style("opacity", 1);
            // .attr("fill",function(d) {
            //     if (d.properties.senDeniers == 2) {return "red"}
            //     else if (d.properties.senDeniers == 1) {return "purple"}
            //     else {return "blue"}
            // })
    }
};