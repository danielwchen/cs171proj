document.getElementById("state-hover").style.visibility = 'hidden';
document.getElementById("congress-hover").style.visibility = 'hidden';

var stateTotalData = {
};
var senData;
var repData;

var electoralMap;
var congressVis;

var dateFormatter = d3.time.format("%d-%b-%Y");

loadData();

function loadData() {

    queue()
        .defer(d3.csv, "data/electoral/stateDeniersTotalnew.csv")
        .defer(d3.csv, "data/electoral/congressFINAL.csv")
        .await(function(error, totalCSV, CSV) {
            totalCSV.forEach(function(d) {
                d.Population = +d.Population;
                d.repDeniers114 = +d.repDeniers114;
                d.repTotal114 = +d.repTotal114;
                d.senDeniers = +d.senDeniers;
                d.senTotal = +d.senTotal;
            });

            CSV = CSV.filter(function(d) {
                return d['Senator'] != "TBD";
            });

            CSV.forEach(function(d) {
                d.AgeAtTakingOfficeYear = +d.AgeAtTakingOfficeYear;
                d.BirthDate = dateFormatter.parse(d.BirthDate);
                d.DateInOffice = dateFormatter.parse(d.DateInOffice);
                // d.YearNextElection = +d.YearNextElection;
                d.YearsInOffice = +d.YearsInOffice;
                d.CurrentAge = +d.CurrentAge;
            });

            var senCSV = CSV.filter(function(d) {
                return d['Position'] == 'sen';
            });

            var repCSV = CSV.filter(function(d) {
                return d['Position'] == 'rep';
            });


            totalCSV.forEach(function(d,index) {
                stateTotalData[d.State] = d;
            });

            console.log(stateTotalData);
            // stateTotalData = totalCSV;
            senData = senCSV;
            repData = repCSV;
            createVis();
        });

}


function createVis() {

    var EventHandler = {};
    electoralMap = new ElectoralMap("#electoral-map",stateTotalData,EventHandler);
    congressVis = new CongressVis("#congress-vis",senData,repData,EventHandler);

    var statePinned = false;
    var congressPersonPinned = false;

    $(EventHandler).bind("stateOver", function(event, state){
        if (!statePinned) {
            electoralMap.onStateOver(state);
            congressVis.onStateOver(state);
            updateStateTable(state);
        }
    });
    $(EventHandler).bind("stateOff", function(event){
        if (!statePinned) {
            electoralMap.onStateOver(null);
            congressVis.onStateOver(null);
            document.getElementById("state-hover").style.visibility = 'hidden';
        }

    });
    $(EventHandler).bind("press", function(event, state){
        electoralMap.pinState(state);
        congressVis.pinState(state);
        statePinned = true;
        updateStateTable(state)
    });
    $(EventHandler).bind("unpress", function(event){
        electoralMap.pinState(null);
        congressVis.pinState(null);
        statePinned = false;
    });
}

function updateStateTable(state) {
    document.getElementById("state-name").innerHTML = state;
    document.getElementById("state-1-1").innerHTML = stateTotalData[state].repTotal114;
    document.getElementById("state-2-0").innerHTML = stateTotalData[state].proportion;
    document.getElementById("state-hover").style.visibility = 'visible';


}

function updateCongressTable() {

}

// THINGS TO DO:
// Implement table updating
// Style table
// Fix map colors