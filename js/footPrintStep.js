
/*
FootStep - Object constructor for side scrolling footprint vis
 */

FootStep = function(_parentElement, _data, _radiusScale){
    this.parentElement = _parentElement;
    this.data = _data;
    this.r = _radiusScale;
    this.initVis();
};

FootStep.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 50, right: 50, bottom: 50, left: 50};

    vis.spacing = 50;

    vis.svg = d3.select(vis.parentElement).append("svg");

    vis.updateVis([])
};

FootStep.prototype.updateVis = function(newData, radiusScale){
    var vis = this;
    if (newData.length != 0){
        vis.data = newData;
        vis.r = radiusScale;
    }

    vis.width = vis.getPhysSize(vis.data) + 200 - vis.margin.left - vis.margin.right,
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.svg
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.circs = vis.svg.selectAll("circle")
        .data(vis.data);

    vis.circs.enter()
        .append("circle");

    vis.tip = d3.tip().attr('class', 'd3-tip').offset([-10,0]).html(function(d) {
        return d.Country + " " + getLabelData(d);
    });

    vis.svg.call(vis.tip);

    vis.xPlaceholder = 0;
    vis.circs
        .transition().duration(1000)
        .attr("class", function(d) {
            return d.Continent;
        })
        .attr("cy", function(d) {
            return vis.height/2 + 50;
        })
        .attr("cx", function(d) {
            d.yVal = vis.width - vis.xPlaceholder - 20 - vis.r(getData(d));
            vis.xPlaceholder = vis.xPlaceholder + 20 + 2*vis.r(getData(d));
            return d.yVal;
        })
        .attr("r", function(d) {return vis.r(getData(d))});
    vis.circs
        .on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);

    // Exit
    vis.circs.exit().remove();

};

FootStep.prototype.getPhysSize = function(countryList){
    var vis = this;

    var physSize = 0;
    countryList.forEach(function(country){
        physSize += (2*vis.r(getData(country)) + 20);
    });
    return physSize;
};

function getData(country){
    var dataType = $('input[name="dataS"]:checked').val();
    return (dataType == "total") ? country.TotalRadius : country.PCRadius;
}

function getLabelData(country){
    var dataType = $('input[name="dataS"]:checked').val();
    return (dataType == "total") ? country.Total : country.PC;
}