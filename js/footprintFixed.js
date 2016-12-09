
/*
 FootFixed - Object constructor for side scrolling footprint vis
 */

FootFixed = function(_parentElement, _data, _radiusScale, _meanTotal, _meanPC){
    this.parentElement = _parentElement;
    this.data = _data;
    this.r = _radiusScale;
    this.meanTotal = _meanTotal;
    this.meanPC = _meanPC;
    this.initVis();
};

FootFixed.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 50, right: 50, bottom: 50, left: 50};

    vis.spacing = 50;

    vis.width = 800 - vis.margin.left - vis.margin.right,
        vis.height = 800 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.xPositions = [50, 130, 350, 250, 400, 90, 300, 250, 140, 550];
    vis.yPositions = [50, 400, 350, 70, 60, 200, 120, 400, 30, 250];


    vis.updateVis(false, vis.r, 0);
};

FootFixed.prototype.updateVis = function(newData, radiusScale, stepNum){
    var vis = this;
    if (newData != false){
        vis.data = newData;
        vis.r = radiusScale;
    }

    vis.circs = vis.svg.selectAll("circle")
        .data(vis.data);

    vis.circs.enter()
        .append("circle");

    vis.circs
        .transition().duration(2000)
        .attr("class", function(d) {
            return d.Continent;
        })
        .attr("cx", function(d, index) {
            return vis.xPositions[index];
            // if (index <= 3) {return index%4 * 150 + 100;}
            // else if(index <=7) {return index%4 * 150 + 150;}
            // else{return index%4 * 300 + 300;}
        })
        .attr("cy", function(d, index) {
            return vis.yPositions[index];
            // if(index <=7){return Math.floor(index/4) * 100 + 50;}
            // else{return Math.floor(index/4) * 100 + 200;}
        })
        .attr("r", function(d) {return vis.r(getData(d))})
        .attr("opacity", function(d, index){
            return (index > stepNum) ? 0 : 50;
        });

    // Exit
    vis.circs.exit().remove();

    vis.circLabels = vis.svg.selectAll("text")
        .data(vis.data);

    vis.circLabels.enter()
        .append("text")
        .attr("class", "country-label");

    vis.circLabels
        .transition().duration(2000)
        .text(function(d){return d.Country + ": " + Math.round(getData(d), -3);})
        .attr("x", function(d, index) {
            return vis.xPositions[index];
            // if (index <= 3) {return index%4 * 150 + 100;}
            // else if(index <=7) {return index%4 * 150 + 150;}
            // else{return index%4 * 300 + 300;}
        })
        .attr("y", function(d, index) {
            return vis.yPositions[index] - 10;
            // if(index <=7){return Math.floor(index/4) * 100 + 50 - 10;}
            // else{return Math.floor(index/4) * 100 + 200 -10;}
        })
        .attr("opacity", function(d, index){
            return (index > stepNum) ? 0 : 100;
        })
        .attr("text-anchor", "middle");

    // Exit
    vis.circLabels.exit().remove();

    // var force = d3.layout.force().alpha(0)
    //     .size([vis.width, vis.height]);
    //
    // force
    //     .nodes(vis.data)
    //     .charge(-50);
    //
    // // 2b) START RUNNING THE SIMULATION
    // force.start();
    //
    // // 4) DRAW THE NODES (SVG CIRCLE)
    // var node = vis.svg.selectAll(".node")
    //     .data(vis.data)
    //     .enter().append("circle")
    //     .attr("class", function(d){return "node " + d.Continent;})
    //     .attr("r", function(d) {return vis.r(getData(d))});
    //
    // // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS
    // force.on("tick", function() {
    //     // Update node coordinates
    //     node
    //         .attr("cx", function(d) { return d.x; })
    //         .attr("cy", function(d) { return d.y; })
    //         .call(force.drag);
    // });
};

function getData(country){
    var dataType = $('input[name="dataS"]:checked').val();
    return (dataType == "total") ? country.TotalRadius : country.PCRadius;
}

function getLabelData(country){
    var dataType = $('input[name="dataS"]:checked').val();
    return (dataType == "total") ? country.Total : country.PC;
}