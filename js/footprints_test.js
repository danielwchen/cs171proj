
// SVG drawing area
var dataType = $('input[name="dataS"]:checked').val();

var allData = [];
var data;
var footSteps = [];

loadData();

// Load CSV file
function loadData() {

    d3.csv("data/carbonByCountry.csv", function(error, csv) {

        csv.forEach(function(d){
            d.Total = +d.Total;
            d.PC = +d.PC;
            d.TotalRadius = Math.sqrt(d.Total)/3.14;
            d.PCRadius = Math.sqrt(d.PC)/3.14;
        });

        data = csv;

        // Draw the visualization for the first time
        updateVisualization();
    });

}

function updateVisualization() {

    data = data.sort(function (a, b) {
        return getData(b) - getData(a);
    });

    allData.push(data.slice(0, 4));
    for (i = 4; i < 164;) {
        allData.push(data.slice(i, i + 20));
        i += 20;
        if (i >= 164) {
            allData.push(data.slice(start = i));
        }
    }
    console.log(allData);

    var visNumber = 1;
    allData.forEach(function(d){
        footSteps.push(new FootStep("#footprint-vis" + visNumber, d));
        visNumber += 1;
    });
}

function getData(country){
    return (dataType == "total") ? country.TotalRadius : country.PCRadius;
}
