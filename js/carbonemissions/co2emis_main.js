
// Will be used to the save the loaded JSON data
var allData = [];

var interactiveData = [];

var totalData = [];

// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y").parse;

var slider = d3.slider();

// Set ordinal color scale
var colorScale = d3.scale.ordinal().range(["#8c510a", "#d8b365", "#ffde4f", "#72ea82", "#72e4ea", "#72acea", "#47709b"]); //d3.scale.category10();

// Variables for the visualization instances
var areachart, timeline;


// Start application by loading the data
queue()
	.defer(d3.csv, "data/co2emissions_sector_edits.csv")
	.defer(d3.csv, "data/population.csv")
	.defer(d3.csv, "data/co2emissions2017.csv")
	.defer(d3.csv, "data/co2emissions_sector.csv")
	.await(loadData);

function loadData(error, emissions, population, interactions, totals) {

	if(error) { console.log(error); }

	population.forEach(function(d) {
		d.Year = parseDate(d.Year);
		d.Population = +d.Population/1000000;
	});
		emissions.forEach(function(d){
			// Convert string to 'date object'
			d.Year = parseDate(d.Year);

			// Convert numeric values to 'numbers'
			d.Electricity = +d.Electricity*1000000;
			d.Transportation = +d.Transportation*1000000;
			d.Industry = +d.Industry*1000000;
			d.Agriculture = +d.Agriculture*1000000;
			d.Commercial = +d.Commercial*1000000;
			d.Residential = +d.Residential*1000000;
			d.Territories = +d.Territories*1000000;
			//d.Total = +d.Total;
		});

		allData = emissions;

		interactions.forEach(function(d){
		// Convert string to 'date object'
		d.Year = parseDate(d.Year);

		// Convert numeric values to 'numbers'
		d.Electricity = +d.Electricity*1000000;
		d.Transportation = +d.Transportation*1000000;
		d.Industry = +d.Industry*1000000;
		d.Agriculture = +d.Agriculture*1000000;
		d.Commercial = +d.Commercial*1000000;
		d.Residential = +d.Residential*1000000;
		d.Territories = +d.Territories*1000000;
	});

		interactiveData = interactions;

	totals.forEach(function(d){
		// Convert string to 'date object'
		d.Year = parseDate(d.Year);

		// Convert numeric values to 'numbers'
		d.Electricity = +d.Electricity*1000000;
		d.Transportation = +d.Transportation*1000000;
		d.Industry = +d.Industry*1000000;
		d.Agriculture = +d.Agriculture*1000000;
		d.Commercial = +d.Commercial*1000000;
		d.Residential = +d.Residential*1000000;
		d.Territories = +d.Territories*1000000;
		d.Total = +d.Total*1000000;
	});
	totalData = totals;

		colorScale.domain(d3.keys(allData[0]).filter(function(d){ return d != "Year"; }));

		// Draw the visualization for the first time
		createVis();
}

function createVis() {

	areachart = new StackedAreaChart("stacked-area-chart", allData, totalData, interactiveData);


}


function brushed() {

	// Update focus chart (detailed information)
	areachart.wrangleData();
}


function myFunction() {
	var val = document.getElementById("slider").value //gets the oninput value
	document.getElementById('output').innerHTML = val //displays this value to the html page
	console.log(val)
}

function updateBar () {
	areachart.wrangleData();

}
