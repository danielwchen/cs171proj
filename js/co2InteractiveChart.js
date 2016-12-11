BarChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = []; // see data wrangling
    // DEBUG RAW DATA
    //console.log(this.data);

    this.initVis();
};

BarChart.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 40, right: 10, bottom: 60, left: 0 };
    vis.width = 150 - vis.margin.left - vis.margin.right,
        vis.height = 400 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Scales and axes
    vis.x = d3.scale.ordinal()
        .rangeRoundBands([0, vis.width])
        .domain(d3.extent(vis.data, function(d) { return d.Year; }));

    vis.y = d3.scale.linear()
        .rangeRound([vis.height, 0])
        .domain([0,  7422207962.77]);

    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom")
        .tickFormat(d3.time.format("%Y"));

    //vis.yAxis = d3.svg.axis()
      //  .scale(vis.y)
      //  .orient("left")
        //.attr("transform", "translate(" + vis.width + " ,0)");

    vis.stack = d3.layout.stack()
        .values(function(d) { return d.values; });

    vis.svg.select(".x-axis").call(vis.xAxis);

    // TO-DO: (Filter, aggregate, modify data)
    vis.wrangleData();
};



/*
 * Data wrangling
 */

BarChart.prototype.wrangleData = function(){
    var vis = this;
    var population = document.getElementById("population").value;
    var initpop = 325000000;
    //var activity = d3.select("#activity").property("value");
    var beef = document.getElementById("beef");
    var shower = document.getElementById("shower");
    var carpool = document.getElementById("carpool");
    var lights = document.getElementById("lights");
    var ac = document.getElementById("ac");
    var bulb = document.getElementById("bulb");
    var insulate = document.getElementById("insulate");
    var recycle = document.getElementById("recycle");
    var package = document.getElementById("package");

    var editedData = jQuery.extend(true, [], vis.data);
    var end = editedData.length - 1;
    var households = 124600000;
    var pounds = 2204.62;

    if (beef.checked) editedData[end]["Agriculture"] -= .544*population*initpop/100;
    if (shower.checked) editedData[end]["Residential"] -= .509*population*initpop/100;
    if (carpool.checked) editedData[end]["Transportation"] -= .5*3.5*population*initpop/100;
    if (lights.checked) editedData[end]["Electricity"] -= editedData[end]["Electricity"]*.05*population/100;
    if (ac.checked) editedData[end]["Electricity"] -= 2000/pounds*households*population/100;
    if (bulb.checked) editedData[end]["Electricity"] -= 90e9/pounds*population/100;
    if (insulate.checked) editedData[end]["Residential"] -= 3700/pounds*households*.9*population/100;
    if (recycle.checked) editedData[end]["Industry"] -= 2400/pounds*households*population/100;
    if (package.checked) editedData[end]["Industry"] -= 1200/pounds*households*population/100;

    // TO-DO: Initialize stack layout
    var dataCategories = colorScale.domain();

    // Rearrange data into layers
    var transposedData = dataCategories.map(function(name) {
        return {
            name: name,
            values: editedData.map(function(d) {
                return {Year: d.Year, y: d[name]};
            })
        };
    });

    //console.log(transposedData);

    // In the first step no data wrangling/filtering needed
    vis.displayData = vis.stack(transposedData);
    //console.log(vis.displayData);

    // Update the visualization
    vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

BarChart.prototype.updateVis = function(){
    var vis = this;

    // Update domain
    // Get the maximum of the multi-dimensional array or in other words, get the highest peak of the uppermost layer

    var layer = vis.svg.selectAll(".layer")
        .data(vis.displayData);

    layer
        .enter().append("rect").attr("class", "layer")
        .style("fill", function(d) {
            return colorScale(d.name);
        })
        .attr("opacity", .8);

    layer
        .attr("x", function() {console.log("print anything!");})//function(d) { return vis.x(d.values.Year); })
        .attr("y", function(d) { console.log(d.values[0].y); return vis.y(d.values[0].y + d.values[0].y0); })
        .attr("height", function(d) { return vis.y(d.values[0].y0) - vis.y(d.values[0].y + d.values[0].y0); })
        .attr("width", vis.x.rangeBand() - 1);

    layer
        .on("mouseover", function(d,i){vis.svg.selectAll(".layer").transition()
            .duration(250)
            .attr("opacity", function(d, j) {
                return j != i ? 0.6 : 0.8;
            });})
        //.on("mouseout", function(){return vis.tooltip.text("");});

    vis.svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + vis.height + ")");
        //.call(vis.xAxis);

    vis.svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + vis.width + ",0)");
        //.call(vis.yAxis);

    layer.exit().remove();

    // TO-DO: Update tooltip text
    /*categories
        .on("mouseover", function(d){return vis.tooltip.text(d.name);})
        .on("mouseout", function(){return vis.tooltip.text("");});*/


    // Call axis functions with the new domain

    //vis.svg.select(".y-axis").call(vis.yAxis);
}
