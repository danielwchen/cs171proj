
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

    vis.xPositions = [45, 340, 300, 430, 590, 90, 130, 260, 150, 520];
    vis.yPositions = [30, 120, 330, 50, 40, 320, 400, 410, 150, 280];
    vis.xPCPositions = [40, 260, 590, 450, 290, 340, 310, 130, 130, 530];
    vis.yPCPositions = [40, 50, 50, 50, 250, 120, 400, 380, 140, 270];

    vis.updateVis(false, vis.r, 0);
};

FootFixed.prototype.updateVis = function(newData, radiusScale, stepNum){
    var vis = this;
    if (newData != false){
        vis.data = newData;
        vis.r = radiusScale;
    }

    var total = ( $('input[name="dataS"]:checked').val() == "total");

    vis.circs = vis.svg.selectAll("circle")
        .data(vis.data, function(d){return d.Country;});

    vis.circs.enter()
        .append("circle");

    vis.circs
        .transition().duration(1000)
        .attr("class", function(d) {
            return d.Continent;
        })
        .attr("cx", function(d, index) {
            return total ? vis.xPositions[index] : vis.xPCPositions[index];
        })
        .attr("cy", function(d, index) {
            return total ? vis.yPositions[index] : vis.yPCPositions[index];
        })
        .attr("r", function(d) {return vis.r(getData(d))})
        .attr("opacity", function(d, index){
            return (index > stepNum) ? 0 : 50;
        });

    // Exit
    vis.circs.exit().remove();

    vis.circLabels = vis.svg.selectAll("text")
        .data(vis.data, function(d){return d.Country;});

    vis.circLabels.enter()
        .append("text")
        .attr("class", "country-label");

    vis.circLabels
        .transition().duration(1000)
        .text(function(d){return d.Country + ": " + getLabelData(d).toFixed(2);})
        .attr("x", function(d, index) {
            return total ? vis.xPositions[index] : vis.xPCPositions[index];
        })
        .attr("y", function(d, index) {
            return total ? vis.yPositions[index] - 10 : vis.yPCPositions[index] - 10;
        })
        .attr("opacity", function(d, index){
            return (index > stepNum) ? 0 : 100;
        })
        .attr("text-anchor", "middle");

    // Exit
    vis.circLabels.exit().remove();
};

function getData(country){
    var dataType = $('input[name="dataS"]:checked').val();
    return (dataType == "total") ? country.TotalRadius : country.PCRadius;
}

function getLabelData(country){
    var dataType = $('input[name="dataS"]:checked').val();
    return (dataType == "total") ? country.Total : country.PC;
}