
// Will be used to the save the loaded JSON data
var allData = [];

var interactiveData = [];

var totalData = [];

// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y").parse;

// Set ordinal color scale
var colorScale = d3.scale.ordinal().range(["#8c510a", "#d8b365", "#ffde4f", "#72ea82", "#72e4ea", "#72acea", "#47709b"]); //d3.scale.category10();
var colorScale2 = d3.scale.category10();

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
	/*d3.queue()
		.defer(d3.csv, "file1.csv")
		.defer(d3.csv, "file2.csv")
		.await(function(error, file1, file2) {
			if (error) {
				console.error('Oh dear, something went wrong: ' + error);
			}
			else {
				doStuff(file1, file2);
			}
		});*/
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
		//d.Total = +d.Total;
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
		/*for (var i = 0; i < allData.length; i++) {
			allData[i].Electricity /= population[i].Population;
			allData[i].Transportation /= population[i].Population;
			allData[i].Industry /= population[i].Population;
			allData[i].Agriculture /= population[i].Population;
			allData[i].Commercial /= population[i].Population;
			allData[i].Residential /= population[i].Population;
			allData[i].Territories /= population[i].Population;
		}*/

		/*interactiveData = interactions;
		interactions.forEach(function(d) {
			d.Year = parseDate(d.Year);
			d.beef = +d.beef;
			d.shower = +d.shower;
			d.carpool = +d.carpool;
			d.other = +d.other;
		})*/


		colorScale.domain(d3.keys(allData[0]).filter(function(d){ return d != "Year"; }));
		//colorScale2.domain(d3.keys(interactiveData[0]).filter(function(d){ return d != "Year"; }));

		// Store csv data in global variable
		//console.log(allData);


		// Draw the visualization for the first time
		createVis();
}

function createVis() {

	// TO-DO: Instantiate visualization objects here
	// areachart = new ...
	areachart = new StackedAreaChart("stacked-area-chart", allData, totalData, interactiveData);


}


function brushed() {

	// TO-DO: React to 'brushed' event
	// Set new domain if brush (user selection) is not empty

	/*areachart.x.domain(
		timeline.brush.empty() ? timeline.x.domain() : timeline.brush.extent()
	);*/

	// Update focus chart (detailed information)
	areachart.wrangleData();
	//interactivechart.wrangleData();


}


function myFunction() {
	var val = document.getElementById("slider").value //gets the oninput value
	document.getElementById('output').innerHTML = val //displays this value to the html page
	console.log(val)
}

function updateBar () {
	//interactivechart.wrangleData();
	areachart.wrangleData();

}
