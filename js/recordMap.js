




RecordMap = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
};

RecordMap.prototype.initVis = function() {

    var vis = this;
    vis.width = 900;
	vis.height = 600;
    vis.filteredData = vis.data;

	vis.svg = d3.select(vis.parentElement).append("svg")
		.attr("width", vis.width)
		.attr("height", vis.height);


    vis.projection = d3.geo.albersUsa();

    vis.path = d3.geo.path()
        .projection(vis.projection);


    vis.year = 2001;

    d3.json("data/us-states.json", function(json) {
        vis.json = json;
        vis.svg.selectAll(".state-border")
            .data(vis.json.features)
            .enter().append("path")
            .attr("class", "state-border")
            .attr("d", vis.path)
            .attr("fill", "yellowgreen")
            .style("stroke-width", "2px");


        vis.wrangleData();
    });

}

RecordMap.prototype.wrangleData = function(){
    var vis = this;
    vis.filteredData = vis.data.filter(function(d, index){
        return d.Year == vis.year;
    });
    console.log(vis.filteredData);

    vis.updateVis();
}

RecordMap.prototype.updateVis = function(){
    var vis = this;
    vis.svg.selectAll(".records")
        .data(vis.filteredData)
        .enter().append("circle")
        .attr("class", "records")
        .attr("r", 3)
        .attr("fill", "navy")
        .attr("transform", function(d){
            return "translate(" + vis.projection([-1 * (+d.Longitude.substring(0, 5)), +(d.Latitude.substring(0, 4))]) + ")";
        });
}
