document.getElementById("state-hover").style.visibility = 'hidden';
document.getElementById("congress-hover").style.visibility = 'hidden';
document.getElementById("tableline").style.visibility = 'hidden';


var stateTotalData = {
};
var offData = {};
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

            CSV.forEach(function(d,index) {
                offData[d.Name] = d;
            });

            // console.log(stateTotalData);
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
    var repPinned = false;
    var pinned = false;

    $(EventHandler).bind("stateOver", function(event, state){
        if (!pinned) {
            electoralMap.highlightState(state);
            congressVis.highlightState(state);
            updateStateTable(state);
            document.getElementById("tableline").style.visibility = 'visible';
        }
    });
    $(EventHandler).bind("stateOff", function(event){
        if (!pinned) {
            electoralMap.highlightState(null);
            congressVis.highlightState(null);
            document.getElementById("state-hover").style.visibility = 'hidden';
            document.getElementById("tableline").style.visibility = 'hidden';
        }

    });
    $(EventHandler).bind("press", function(event, state){
        if (pinned) {
            electoralMap.highlightState(null);
            congressVis.highlightState(null);
            statePinned = false;
            repPinned = false;
            pinned = false;
        } else {
            electoralMap.highlightState(state);
            congressVis.highlightState(state);
            statePinned = true;
            repPinned = false;
            pinned = true;
            updateStateTable(state)
            document.getElementById("tableline").style.visibility = 'visible';
        }
    });
    $(EventHandler).bind("repOver", function(event, rep){
        if (repPinned) {

        } else {
            updateCongressTable(rep);
            document.getElementById("tableline").style.visibility = 'visible';
        }

        if (pinned) {

        } else {
            updateCongressTable(rep);
            electoralMap.highlightState(offData[rep].State);
            congressVis.highlightRep(rep);
            updateStateTable(offData[rep].State);
            document.getElementById("tableline").style.visibility = 'visible';
        }
    });
    $(EventHandler).bind("repOff", function(event){
        if (pinned) {

        } else {
            electoralMap.highlightState(null);
            congressVis.highlightRep(null);
            document.getElementById("congress-hover").style.visibility = 'hidden';
            document.getElementById("state-hover").style.visibility = 'hidden';
            document.getElementById("tableline").style.visibility = 'hidden';
        }
    });
    $(EventHandler).bind("repPress", function(event, rep){

        if (pinned) {
            electoralMap.highlightState(null);
            congressVis.highlightRep(null);
            statePinned = false;
            repPinned = false;
            pinned = false;
        } else {
            electoralMap.highlightState(offData[rep].State);
            congressVis.highlightRep(rep);
            repPinned = true;
            statePinned = false;
            pinned = true;
            updateStateTable(offData[rep].State);
            updateCongressTable(rep);
            document.getElementById("tableline").style.visibility = 'visible';
        }

    });
}

function updateStateTable(state) {
    document.getElementById("state-name").innerHTML = state;
    document.getElementById("state-1-1").innerHTML = stateTotalData[state].repTotal114;
    document.getElementById("state-2-0").innerHTML = stateTotalData[state].proportion;
    document.getElementById("state-hover").style.visibility = 'visible';


}

function updateCongressTable(rep) {
    var temprep = offData[rep]
    console.log(temprep)
    document.getElementById("congress-name").innerHTML = rep;
    if (temprep.Position == "sen") {
        document.getElementById("congress-1-0").innerHTML = "Senator";
    } else {
        document.getElementById("congress-1-0").innerHTML = "Representative";
    }
    document.getElementById("congress-1-2").innerHTML = temprep.State;
    if (temprep.BelieveClimateChange == "Yes") {
        document.getElementById("congress-2-1").innerHTML = "Climate Champion!";
    } else {
        document.getElementById("congress-2-1").innerHTML = "Climate Denier!";
    }

    
    document.getElementById("optional").innerHTML = "";

    if (temprep.Gender == "M") {
        document.getElementById("pronoun1").innerHTML = "him";
        document.getElementById("pronoun2").innerHTML = "him";
    } else {
        document.getElementById("pronoun1").innerHTML = "her";
        document.getElementById("pronoun2").innerHTML = "her";
    }

    document.getElementById("congress-4-1").innerHTML = temprep.Phone;
    if (temprep.Contact_URL != undefined) {
        document.getElementById("congress-5-1").innerHTML = "<a href=\""+temprep.Contact_URL + "\">Click here!</a>";
    } else {
        document.getElementById("congress-5-1").innerHTML = "<a href=\""+temprep.Url + "\">Click here!</a>";
    }

    document.getElementById("congress-6-1").innerHTML = temprep.Address;
    document.getElementById("congress-hover").style.visibility = 'visible';
}

// THINGS TO DO:
// Implement table updating
// Style table
// Fix map colors