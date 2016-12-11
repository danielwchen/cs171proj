StackedAreaChart = function(_percent){
    this.percent = _percent;
    this.initVis();
};

StackedAreaChart.prototype.initVis = function() {
    var vis = this;
    console.log(vis.data);

    vis.margin = {top: 40, right: 10, bottom: 60, left: 10};
    vis.width = 300 - vis.margin.left - vis.margin.right,
        vis.height = 400 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.svg.selectAll("text")
        .data(this.percent)
        .enter()

};

