

// var projection = d3.geo.albersUSA();


// var path = d3.geo.path()
//     .projection(projection);

// svg.selectAll("path").append("path")
//     .attr("d", path)
//     .attr("fill", "steelblue")


RecordMap = function(_parentElement, _data) {

    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
};

RecordMap.prototype.initVis = function() {

    var vis = this;
    vis.width = 800;
	vis.height = 600;


	vis.svg = d3.select(vis.parentElement).append("svg")
		.attr("width", vis.width)
		.attr("height", vis.height);

	console.log("testing")

}