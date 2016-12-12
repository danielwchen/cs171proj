var recordsData;
var recordMap;
var highTemps, lowTemps;
var maxStep = 2012;

var slider = d3.slider();


// var yearFormatter = d3.time.format("%Y");
// var monthFormatter = d3.time.format("%m");


var formatDate = d3.time.format("%Y");

loadData();




function loadData(){
        queue()
        .defer(d3.csv, "data/allCityRecords.csv")
                .defer(d3.csv, "data/HighestAvgTemperatureUSByYear.csv")
                .defer(d3.csv, "data/LowestAvgTemperatureUSByYear.csv")
        .await(function(error, tempRecordsCSV, high, low) {
                tempRecordsCSV.forEach(function(d){
                        // d.Year = yearFormatter.parse(d.Year);
                        // d.Month = monthFormatter.parse(d.Month);
                        d.Temperature = +d.Temperature;
                });

                        high.forEach(function(d){
                                // console.log(parseInt(d.Year).toString());
                                d.Year = formatDate.parse(parseInt(d.Year).toString());
                                d.High = +d.High;
                        });

                        low.forEach(function(d){
                                d.Year = formatDate.parse(parseInt(d.Year).toString());
                                d.Low = +d.Low;
                        })


                recordsData = tempRecordsCSV;
                        highTemps = high;
                        lowTemps = low;
                createVis();


                        initializeScatterPlot();
        });
}


function createVis() {
        recordMap = new RecordMap("#extremeTempVis", recordsData);
}
