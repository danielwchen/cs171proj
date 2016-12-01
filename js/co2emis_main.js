
// Will be used to the save the loaded JSON data
var allData = [];

// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y").parse;

// Set ordinal color scale
var colorScale = d3.scale.category20();

// Variables for the visualization instances
var areachart, timeline;


// Start application by loading the data
queue()
	.defer(d3.csv, "data/co2emissions_sector_edits.csv")
	.defer(d3.csv, "data/population.csv")
	.await(loadData);

function loadData(error, emissions, population) {
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
			d.Electricity = +d.Electricity;
			d.Transportation = +d.Transportation;
			d.Industry = +d.Industry;
			d.Agriculture = +d.Agriculture;
			d.Commercial = +d.Commercial;
			d.Residential = +d.Residential;
			d.Territories = +d.Territories;
			//d.Total = +d.Total;
		});

		allData = emissions;
		for (var i = 0; i < allData.length; i++) {
			allData[i].Electricity /= population[i].Population;
			allData[i].Transportation /= population[i].Population;
			allData[i].Industry /= population[i].Population;
			allData[i].Agriculture /= population[i].Population;
			allData[i].Commercial /= population[i].Population;
			allData[i].Residential /= population[i].Population;
			allData[i].Territories /= population[i].Population;
		}
		colorScale.domain(d3.keys(allData[0]).filter(function(d){ return d != "Year"; }));

		// Store csv data in global variable
		//console.log(allData);


		// Draw the visualization for the first time
		createVis();
}

function createVis() {

	// TO-DO: Instantiate visualization objects here
	// areachart = new ...
	areachart = new StackedAreaChart("stacked-area-chart", allData);


}


function brushed() {

	// TO-DO: React to 'brushed' event
	// Set new domain if brush (user selection) is not empty

	/*areachart.x.domain(
		timeline.brush.empty() ? timeline.x.domain() : timeline.brush.extent()
	);*/

	// Update focus chart (detailed information)
	areachart.wrangleData();


}
