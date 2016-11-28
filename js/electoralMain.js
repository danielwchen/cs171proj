var allData = [];
var stateTotalData;
var senData;

// Variable for the visualization instance
var electoralMap;
var congressVis;

var dateFormatter = d3.time.format("%d-%b-%Y");

// Start application by loading the data
loadData();

function loadData() {


    // $.getJSON(proxy+url, function(jsonData){
    //
    //     data = jsonData.station;
    //     data.forEach(function(d){
    //         d.id = +d.id;
    //         d.lat = +d.lat;
    //         d.long = +d.long;
    //         // d.nbBikes = +d.nbBikes;
    //         // d.nbEmptyDocks = +d.nbEmptyDocks;
    //     });
    //
    //     $("#station-count").text(data.length);
    //
    //
    // });
    queue()
        .defer(d3.csv, "data/electoral/stateDeniersTotal.csv")
        .defer(d3.csv, "data/electoral/senators.csv")
        .await(function(error, totalCSV, senCSV) {

            totalCSV.forEach(function(d) {
                d.Population = +d.Population;
                d.repDeniers114 = +d.repDeniers114;
                d.repTotal114 = +d.repTotal114;
                d.senDeniers = +d.senDeniers;
                d.senTotal = +d.senTotal;
            });

            senCSV = senCSV.filter(function(d) {
                return d['115Member'] == 1;
            });

            senCSV = senCSV.filter(function(d) {
                return d['Senator'] != "TBD";
            });

            senCSV.forEach(function(d) {
                d.AgeAtTakingOfficeDay = +d.AgeAtTakingOfficeDay;
                d.AgeAtTakingOfficeYear = +d.AgeAtTakingOfficeYear;
                d.BirthDate = dateFormatter.parse(d.BirthDate);
                d.DateInOffice = dateFormatter.parse(d.DateInOffice);
                d.YearNextElection = +d.YearNextElection;
                d.YearsInOffice = +d.YearsInOffice;
            });
            // console.log(totalCSV);
            // console.log(senCSV);

            stateTotalData = totalCSV;
            senData = senCSV;
            createVis();
        });

}


function createVis() {

    var EventHandler = {};
    electoralMap = new ElectoralMap("#electoral-map",stateTotalData,EventHandler);
    congressVis = new CongressVis("#congress-vis",senData);
    // $(EventHandler).bind("selectionChanged", function(event, rangeStart, rangeEnd){
        // $("#startDate").text(dateFormatter(rangeStart));
        // $("#endDate").text(dateFormatter(rangeEnd));
        // ageVis.onSelectionChange(rangeStart, rangeEnd);
        // prioVis.onSelectionChange(rangeStart, rangeEnd);
    // });

}