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
        .defer(d3.json, "data/electoral/reps.json")
        .await(function(error, totalCSV, senCSV, JSON) {
            console.log(JSON);
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
                d.CurrentAge = +d.CurrentAge;
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
    $(EventHandler).bind("press", function(event, statePinned){
        electoralMap.pinState(statePinned);
        congressVis.pinState(statePinned);
    });
    $(EventHandler).bind("unpress", function(event){
        electoralMap.pinState(null);
        congressVis.pinState(null);
    });

}


// Current Age (6)
// 30-39 (1)
// 40-49 (13)
// 50-59 (25)
// 60-69 (38)
// 70-79 (15)
// 80-89 (7)
// Age when taking office (4)
// 30-39 (5)
// 40-49 (33)
// 50-59 (40)
// 60-69 (21)
// Years in office (5)
// 0-9 (59)
// 10-19 (23)
// 20-29 (10)
// 30-39 (5)
// 40-49 (2)
// Year of next election (3)
// 2018 (33)
// 2020 (33)
// 2022 (33)
// Party
// Dem (46)
// Independent (2)
// Rep (51)