

/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

StackedAreaChart = function(_parentElement, _data, _extraData, _data2017){
	this.parentElement = _parentElement;
  this.data = _data;
	this.extraData = _extraData;
  this.displayData = []; // see data wrangling
	this.percentage = 0.0;
	this.previous = 0.0;
    this.data2017 = _data2017;
	this.edited2017 = [];
    this.barDisplayData = [];
    this.barEditedData = [];
  // DEBUG RAW DATA
  //console.log(this.data);

  this.initVis();
};



/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

StackedAreaChart.prototype.initVis = function(){
	var vis = this;

	vis.margin = { top: 40, right: 700, bottom: 40, left: 100 };
	vis.width = 1200 - vis.margin.left - vis.margin.right,
  	vis.height = 400 - vis.margin.top - vis.margin.bottom;


  // SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// TO-DO: Overlay with path clipping
	vis.svg.append("defs").append("clipPath")
		.attr("id", "clip")
		.append("rect")
		.attr("width", vis.width)
		.attr("height", vis.height);


	// Scales and axes
  vis.x = d3.time.scale()
  	.range([0, vis.width])
  	.domain(d3.extent(vis.data, function(d) { return d.Year; }));

	vis.y = d3.scale.linear()
		.range([vis.height, 0]);

	vis.xAxis = d3.svg.axis()
		  .scale(vis.x)
		  .orient("bottom")
		.ticks(5);

	var formatValue = d3.format(".2s");

	vis.yAxis = d3.svg.axis()
	    .scale(vis.y)
	    .orient("left")
		.tickFormat(function(d) { return formatValue(d).replace('G', ' Billion'); });

	vis.svg.append("g")
	    .attr("class", "x-axis axis")
	    .attr("transform", "translate(0," + vis.height + ")");

	vis.svg.append("g")
			.attr("class", "y-axis axis");

	vis.stack = d3.layout.stack()
		.values(function(d) { return d.values; });

	// TO-DO: Stacked area layout
	vis.area = d3.svg.area()
		.interpolate("cardinal")
		.x(function(d) { return vis.x(d.Year); })
		.y0(function(d) { return vis.y(d.y0); })
		.y1(function(d) { return vis.y(d.y0 + d.y); });


	// TO-DO: Tooltip placeholder
	vis.tooltip = vis.svg.append("text")
		.text("")
		.attr("x", 10)
		.attr("y", 10);

	vis.svg.append("text")
		.attr("class", "2017")
		.text("2017")
		.attr("font-size", 30)
		.attr("x", vis.width+65)
		.attr("y", vis.height+30)

	vis.svg.append("text")
		.attr("class", "2017")
		.text("2017")
		.attr("font-size", 30)
		.attr("x", vis.width+265)
		.attr("y", vis.height+30)

	vis.svg.append("text")
		.attr("class", "labels17")
		.text("Including Changes")
		.attr("font-size", 20)
		.attr("x", vis.width+20)
		.attr("y", 20)

	vis.svg.append("text")
		.attr("class", "labels17")
		.text("Current Projection")
		.attr("font-size", 20)
		.attr("x", vis.width+220)
		.attr("y", 20)

	vis.svg.append("text")
		.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (-vis.margin.left+15) +","+(vis.height/2)+")rotate(-90)")
		.attr("id", "label1")
		.text("Metric Tons of Carbon Emissions Per Year");

	// TO-DO: (Filter, aggregate, modify data)
	vis.wrangleData();
};



/*
 * Data wrangling
 */

StackedAreaChart.prototype.wrangleData = function(){
	var vis = this;

	var population = slider.value();
	document.getElementById("demo").innerHTML = population + "% of people will:";
	vis.previous = vis.percentage;

	//var population = document.getElementById("population").value;
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
	var newTotal = 0;

    vis.edited2017 = jQuery.extend(true, [], vis.data2017);
    var end2017 = vis.edited2017.length-1;

	if (beef.checked) {editedData[(end)]["Agriculture"] -= .544*population*initpop/100; vis.edited2017[end2017]["Agriculture"] -= .544*population*initpop/100;}
	if (shower.checked) { editedData[end]["Residential"] -= .509*population*initpop/100; vis.edited2017[end2017]["Residential"] -= .509*population*initpop/100;}
	if (carpool.checked) { editedData[end]["Transportation"] -= .5*3.5*population*initpop/100; vis.edited2017[end2017]["Transportation"] -= .5*3.5*population*initpop/100;}
	if (lights.checked) { editedData[end]["Electricity"] -= editedData[end]["Electricity"]*.05*population/100; vis.edited2017[end2017]["Electricity"] -= vis.edited2017[end2017]["Electricity"]*.05*population/100;}
	if (ac.checked) { editedData[end]["Electricity"] -= 2000/pounds*households*population/100; vis.edited2017[end2017]["Electricity"] -= 2000/pounds*households*population/100;}
	if (bulb.checked) { editedData[end]["Electricity"] -= 90e9/pounds*population/100; vis.edited2017[end2017]["Electricity"] -= 90e9/pounds*population/100;}
	if (insulate.checked) { editedData[end]["Residential"] -= 3700/pounds*households*.9*population/100; vis.edited2017[end2017]["Residential"] -= 3700/pounds*households*.9*population/100;}
	if (recycle.checked) { editedData[end]["Industry"] -= 2400/pounds*households*population/100; vis.edited2017[end2017]["Industry"] -= 2400/pounds*households*population/100;}
	if (package.checked) {editedData[end]["Industry"] -= 1200/pounds*households*population/100; vis.edited2017[end2017]["Industry"] -= 1200/pounds*households*population/100;}

	newTotal = editedData[end]["Territories"] + editedData[end]["Residential"] + editedData[end]["Commercial"] + editedData[end]["Agriculture"] + editedData[end]["Industry"] + editedData[end]["Electricity"]
	+ editedData[end]["Transportation"];

	vis.percentage = (vis.extraData[end].Total - newTotal)/vis.extraData[end].Total;

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

    var barEditedData = dataCategories.map(function(name) {
        return {
            name: name,
            values: vis.edited2017.map(function(d) {
                return {Year: d.Year, y: d[name]};
            })
        };
    });

    var barTransData = dataCategories.map(function(name) {
        return {
            name: name,
            values: vis.data2017.map(function(d) {
                return {Year: d.Year, y: d[name]};
            })
        };
    });

    vis.barEditedData = vis.stack(barEditedData);

    vis.barDisplayData = vis.stack(barTransData);

	// In the first step no data wrangling/filtering needed
	vis.displayData = vis.stack(transposedData);

  vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

StackedAreaChart.prototype.updateVis = function(){
	var vis = this;

	var formatValue = d3.format(".3s");

	// Update domain
	// Get the maximum of the multi-dimensional array or in other words, get the highest peak of the uppermost layer
	vis.y.domain([0, d3.max(vis.displayData, function(d) {
			return d3.max(d.values, function(e) {
				return e.y0 + e.y;
			});
		})
	]);

	var maximum = d3.max(vis.displayData, function(d) {
		return d3.max(d.values, function(e) {
			return e.y0 + e.y;
		});
	});

	function formatPercent(p) {
		if (p < 0) p=0;
		p *= 100;
		return formatValue(p);
	}

	vis.svg.selectAll(".percent").remove();


    var start_val = (vis.previous*100).toFixed(2);
        var end_val = (vis.percentage*100).toFixed(2);
        var duration = 1000;

   var percentChange = vis.svg.append("text").attr("class", "percent")
       .attr("x", 865)
       .attr("y", 175)
	   .attr("font-size", 30)
       .text(start_val)
       .transition()
       .duration(duration)
       .ease('linear')
       .tween("text", function() {
           var i = d3.interpolate(this.textContent, end_val),
               prec = (end_val + "").split("."),
               round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
           return function(t) {
               this.textContent = Math.round(i(t) * round) / round + "%";
           };
       });

	var percentLabel = vis.svg.append("text").attr("class", "percent-label")
		.attr("x", 830)
		.attr("y", 195)
		.attr("font-size", 15)
		.text("decrease in carbon")
	var percentLabel2 = vis.svg.append("text").attr("class", "percent-label")
		.attr("x", 850)
		.attr("y", 213)
		.attr("font-size", 15)
		.text("emissions")

	// Draw the layers
	var categories = vis.svg.selectAll(".area")
      .data(vis.displayData)
  ;
  categories.enter().append("path")
      .attr("class", "area");

  categories
	  .transition()
	  .duration(1000)
  		.style("fill", function(d) { 
  			return colorScale(d.name);
  		})
      .attr("d", function(d) {
				return vis.area(d.values);
      })
	  .attr("opacity", 0.7);


  // TO-DO: Update tooltip text
	categories
		.on("mouseover", function(d){vis.svg.selectAll("rect").transition()
			.duration(250)
			.attr("opacity", 1); return vis.tooltip.text(d.name);})
		.on("mouseout", function(d,i){return vis.tooltip.text("");})
		.on("mousemove", function(section) {
			var bisectDate = d3.bisector(function(d) { return d.Year; }).left;


			// **********
			var x0 = vis.x.invert(d3.mouse(this)[0]),              // **********
				i = bisectDate(vis.extraData, x0, 1),
				d0 = vis.extraData[i - 1],                              // **********
				d1 = vis.extraData[i],                                  // **********
				d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;

			var formatDate = d3.time.format("%Y");
			// append the x line
			vis.svg.append("line")
				.attr("class", "x")
				.style("stroke", "black")
				.style("opacity", 0.8)
				.attr("y1", 0)
				.attr("y2", vis.height);

			// place the value at the intersection
			vis.svg.append("text")
				.attr("class", "y1")
				.style("stroke", "white")
				.style("stroke-width", "3.5px")
				.style("opacity", 0.8)
				.attr("dx", 8)
				.attr("dy", "1.3em");
			vis.svg.append("text")
				.attr("class", "y2")
				.attr("dx", 8)
				.attr("dy", "1.3em");

			// place the date at the intersection
			vis.svg.append("text")
				.attr("class", "y3")
				.style("stroke", "white")
				.style("stroke-width", "3.5px")
				.style("opacity", 0.8)
				.attr("dx", 4)
				.attr("dy", "2.6em");
			vis.svg.append("text")
				.attr("class", "y4")
				.attr("dx", 4)
				.attr("dy", "2.6em");

			var test = section.values[i].y0+ section.values[i].y;

			vis.svg.select("text.y1")
				.attr("transform",
					"translate(" + vis.x(d.Year) + "," +
					/*vis.y(d.Total)*/ (vis.y(test)) + ")")
				.text(section.name + " "+formatValue(d[section.name]).replace('G', 'B'));

			vis.svg.select("text.y2")
				.attr("transform",
					"translate(" + vis.x(d.Year) + "," +
					/*vis.y(d.Total)*/ (vis.y(test)) + ")")
				.text(section.name + " "+ formatValue(d[section.name]).replace('G', 'B'));

			vis.svg.select("text.y3")
				.attr("transform",
					"translate(" + vis.x(d.Year) + "," +
					/*vis.y(d.Total)*/ (vis.y(test)) + ")")
				.text(formatDate(d.Year).replace("2018", "2017").replace("2019", "2017").replace("2020", "2017"));

			vis.svg.select("text.y4")
				.attr("transform",
					"translate(" + vis.x(d.Year) + "," +
					/*vis.y(d.Total)*/ (vis.y(test)) + ")")
				.text(formatDate(d.Year).replace("2018", "2017").replace("2019", "2017").replace("2020", "2017"));

			vis.svg.select(".x")
				.attr("transform",
					"translate(" + vis.x(d.Year) + "," +
					vis.height + ")")
				.attr("y2", -vis.height + vis.y(test));

			});

	categories.exit().remove();

	var layer = vis.svg.selectAll(".layer")
		.data(vis.barEditedData);

	layer
		.enter().append("rect").attr("class", "layer")
		.style("fill", function(d) {
			return colorScale(d.name);
		})
		.attr("opacity", 0.7);

	layer
		.transition()
		.duration(1000)
		.attr("x", vis.width)
		.attr("y", function(d) {return vis.y(d.values[0].y + d.values[0].y0); })
		.attr("height", function(d) { return vis.y(d.values[0].y0) - vis.y(d.values[0].y + d.values[0].y0); })
		.attr("width", 200);

	layer
		.on("mouseover", function(d,i){vis.svg.selectAll(".layer").transition()
					.duration(250)
					.attr("opacity", function(d, j) {
						return j != i ? 0.7 : 1;
			}); return vis.tooltip.text(d.name);})
		.on("mouseout", function(d,i){return vis.tooltip.text("");})
		.on("mousemove", function(section) {
			var bisectDate = d3.bisector(function(d) { return d.Year; }).left;

			// place the value at the intersection
			vis.svg.append("text")
				.attr("class", "y1")
				.style("stroke", "white")
				.style("stroke-width", "3.5px")
				.style("opacity", 0.8)
				.attr("dx", 0)
				.attr("dy", "1.3em");
			vis.svg.append("text")
				.attr("class", "y2")
				.attr("dx", 0)
				.attr("dy", "1.3em");

			// place the date at the intersection
			vis.svg.append("text")
				.attr("class", "y3")
				.style("stroke", "white")
				.style("stroke-width", "3.5px")
				.style("opacity", 0.8)
				.attr("dx", 0)
				.attr("dy", "2.6em");
			vis.svg.append("text")
				.attr("class", "y4")
				.attr("dx", 0)
				.attr("dy", "2.6em");
			vis.svg.select("circle.y")
				.attr("transform",
					"translate(500," +
					vis.y(vis.data2017.Total) + ")");

			var test = section.values[0].y0+ section.values[0].y;

			vis.svg.select("text.y1")
				.attr("transform",
					"translate(450," +
					/*vis.y(d.Total)*/ (vis.y(test)) + ")")
				.text(section.name + " "+formatValue(vis.edited2017[0][section.name]).replace('G', 'B'));

			vis.svg.select("text.y2")
				.attr("transform",
					"translate(450," +
					/*vis.y(d.Total)*/ (vis.y(test)) + ")")
				.text(section.name + " "+ formatValue(vis.edited2017[0][section.name]).replace('G', 'B'));

			vis.svg.select("text.y3")
				.attr("transform",
					"translate(450," +
					/*vis.y(d.Total)*/ (vis.y(test)) + ")")
				.text("2017");

			vis.svg.select("text.y4")
				.attr("transform",
					"translate(450," +
					/*vis.y(d.Total)*/ (vis.y(test)) + ")")
				.text("2017");

			vis.svg.select(".y")
				.attr("transform",
					"translate(" + vis.width * -1 + "," +
					vis.y(vis.data2017.Total) + ")")
				.attr("x2", vis.width + vis.width);

		});

	layer.exit().remove();

	var layer2 = vis.svg.selectAll(".layer2")
		.data(vis.barDisplayData);

	layer2
		.enter().append("rect").attr("class", "layer2")
		.style("fill", function(d) {
			return colorScale(d.name);
		})
		.attr("opacity", .7);

	layer2
		.transition()
		.duration(1000)
		.attr("x", vis.width+200)
		.attr("y", function(d) { return vis.y(d.values[0].y + d.values[0].y0); })
		.attr("height", function(d) { return vis.y(d.values[0].y0) - vis.y(d.values[0].y + d.values[0].y0); })
		.attr("width", 200)

	layer2
		.on("mouseover", function(d,i){vis.svg.selectAll(".layer2").transition()
			.duration(250)
			.attr("opacity", function(d, j) {
				return j != i ? 0.7 : 1;
			}); return vis.tooltip.text(d.name);})
		.on("mouseout", function(d,i){return vis.tooltip.text("");})
		.on("mousemove", function(section) {
			var bisectDate = d3.bisector(function(d) { return d.Year; }).left;

			// place the value at the intersection
			vis.svg.append("text")
				.attr("class", "y1")
				.style("stroke", "white")
				.style("stroke-width", "3.5px")
				.style("opacity", 0.8)
				.attr("dx", 0)
				.attr("dy", "1.3em");
			vis.svg.append("text")
				.attr("class", "y2")
				.attr("dx", 0)
				.attr("dy", "1.3em");

			// place the date at the intersection
			vis.svg.append("text")
				.attr("class", "y3")
				.style("stroke", "white")
				.style("stroke-width", "3.5px")
				.style("opacity", 0.8)
				.attr("dx", 0)
				.attr("dy", "2.6em");
			vis.svg.append("text")
				.attr("class", "y4")
				.attr("dx", 0)
				.attr("dy", "2.6em");
			vis.svg.select("circle.y")
				.attr("transform",
					"translate(500," +
					vis.y(vis.data2017.Total) + ")");

			var test = section.values[0].y0+ section.values[0].y;

			vis.svg.select("text.y1")
				.attr("transform",
					"translate(650," +
					/*vis.y(d.Total)*/ (vis.y(test)) + ")")
				.text(section.name + " "+formatValue(vis.data2017[0][section.name]).replace('G', 'B'));

			vis.svg.select("text.y2")
				.attr("transform",
					"translate(650," +
					/*vis.y(d.Total)*/ (vis.y(test)) + ")")
				.text(section.name + " "+ formatValue(vis.data2017[0][section.name]).replace('G', 'B'));

			vis.svg.select("text.y3")
				.attr("transform",
					"translate(650," +
					/*vis.y(d.Total)*/ (vis.y(test)) + ")")
				.text("2017");

			vis.svg.select("text.y4")
				.attr("transform",
					"translate(650," +
					/*vis.y(d.Total)*/ (vis.y(test)) + ")")
				.text("2017");

			vis.svg.select(".y")
				.attr("transform",
					"translate(" + vis.width * -1 + "," +
					vis.y(vis.data2017.Total) + ")")
				.attr("x2", vis.width + vis.width);

		});

	layer2.exit().remove();

	vis.svg.append("line")
		.attr("x1", vis.width)
		.attr("x2", vis.width)
		.attr("y1", 0)
		.attr("y2", vis.height)
		.attr("stroke", "black")
		.attr("stroke-width", 3)
		.attr("stroke-dasharray", "5")
		.attr("opacity", 1)

	vis.svg.append("line")
		.attr("x1", vis.width+200)
		.attr("x2", vis.width+200)
		.attr("y1", 0)
		.attr("y2", vis.height)
		.attr("stroke", "black")
		.attr("stroke-width", 3)
		.attr("stroke-dasharray", "5")
		.attr("opacity", 1)


	var bisectDate = d3.bisector(function(d) { return d.Year; }).left;

	// Call axis functions with the new domain 
	vis.svg.select(".x-axis").call(vis.xAxis);
  vis.svg.select(".y-axis").call(vis.yAxis);
}
