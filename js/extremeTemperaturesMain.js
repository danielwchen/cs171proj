var recordsData;
var recordMap;


// var yearFormatter = d3.time.format("%Y");
// var monthFormatter = d3.time.format("%m");

loadData();



function loadData(){
        queue()
        .defer(d3.csv, "data/allCityRecords.csv")
        .await(function(error, tempRecordsCSV) {
                tempRecordsCSV.forEach(function(d){
                        // d.Year = yearFormatter.parse(d.Year);
                        // d.Month = monthFormatter.parse(d.Month);
                        d.Temperature = +d.Temperature;
                });


                recordsData = tempRecordsCSV;
                createVis();
        });
}


function createVis() {
        recordMap = new RecordMap("#extremeTempVis", recordsData);
}