var stateTotalData;
var senData;

var electoralMap;
var congressVis;

var dateFormatter = d3.time.format("%d-%b-%Y");

loadData();

function loadData() {

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

            stateTotalData = totalCSV;
            senData = senCSV;
            createVis();
        });

}


function createVis() {

    var EventHandler = {};
    electoralMap = new ElectoralMap("#electoral-map",stateTotalData,EventHandler);
    congressVis = new CongressVis("#congress-vis",senData,EventHandler);
    $(EventHandler).bind("stateOver", function(event, stateHover){
        electoralMap.onStateOver(stateHover);
        congressVis.onStateOver(stateHover);
    });
    $(EventHandler).bind("stateOff", function(event){
        electoralMap.onStateOver(null);
        congressVis.onStateOver(null);
    });

}