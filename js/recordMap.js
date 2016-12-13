




RecordMap = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
};

RecordMap.prototype.initVis = function() {

    var vis = this;
    vis.width = 600;
    vis.height = 450;
    vis.filteredData = vis.data;

    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height);


    vis.projection = d3.geo.albersUsa()
        .translate([300, 225])
        .scale(750);

    vis.path = d3.geo.path()
        .projection(vis.projection);


    vis.year = 1820;

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
    // console.log(vis.year);
    vis.filteredData = vis.data.filter(function(d, index){
        return d.Year == vis.year;
    });
    // console.log(vis.filteredData);

    vis.updateVis();
}

RecordMap.prototype.updateVis = function(){
    var vis = this;


    vis.records = vis.svg.selectAll(".records")
        .data(vis.filteredData);

    // console.log(vis.records);

    // tooltips
    tip
        .offset([-10, 10])
        .attr("class", "d3-tip")
        .html(function(d) {
            return "<p>"  +d.City + "<br>" + d.Month + ", " +  d.Temperature + " (C) </p>"
        });

    svg.call(tip);

    vis.records
        .enter().append("circle")
        .attr("fill", "darkred")
        .transition()
        .duration(50)
        .attr("class", "records tooltip-circle")
        .on('mouseover', function(d){
            console.log(d);
            console.log("mouseover")
            return tip.show;
        })
        .on('mouseout', tip.hide)
        .attr("r", 3)
        .attr("cx", function(d){
            return vis.projection([-1 * (+d.Longitude.substring(0, 5)), +(d.Latitude.substring(0, 4))])[0];
        })
        .attr("cy", function(d){
            return vis.projection([-1 * (+d.Longitude.substring(0, 5)), +(d.Latitude.substring(0, 4))])[1];
        })
        // .attr("transform", function(d){
        //     return "translate(" + vis.projection([-1 * (+d.Longitude.substring(0, 5)), +(d.Latitude.substring(0, 4))]) + ")";
        // })
        .transition();

    vis.records.exit().remove();




    var selValue = document.querySelector('input[name="view"]:checked').id;
    if (selValue == "switch_3_left"){
        if (vis.year < maxStep){
            console.log(vis.year);
            setTimeout(function(){
                vis.year++;
                slider.value(vis.year);
                vis.wrangleData();
                d3.select('#slidertext').text(vis.year);
                updateYear();
            }, 400);
        } else {
            document.getElementById("switch_3_left").checked = false;
            document.getElementById("switch_3_center").checked = true;
        }
    }
}

RecordMap.prototype.play = function(){
    var vis = this;
    // vis.year++;
    slider.value(vis.year);
    vis.wrangleData();

    d3.select('#slidertext').text(vis.year);
}
