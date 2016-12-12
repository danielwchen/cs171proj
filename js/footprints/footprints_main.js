
var allData = [],
    footSteps = [],
    chosen = [],
    data,
    fixedObj,
    meanTotal,
    meanPC,
    radiusScale,
    stepNum = 0;

loadData();

// Load CSV file
function loadData() {

    d3.csv("data/carbonByCountry.csv", function(error, csv) {

        csv.forEach(function(d){
            d.Total = +d.Total;
            d.PC = +d.PC;
            d.TotalRadius = Math.sqrt(d.Total)/3.14;
            d.PCRadius = Math.sqrt(d.PC)/3.14;
            d.Continent = d.Continent.replace(/\s/g, '-');
        });

        data = csv;

        meanTotal = data.map(function(d){return d.Total;}).reduce(function(a, b){return a + b;},0) / data.length;
        meanPC = data.map(function(d){return d.PC;}).reduce(function(a, b){return a + b;},0) / data.length;

        // Draw the visualization for the first time
        initVisualization();
    });

}

function initVisualization() {

    data = data.sort(function (a, b) {
        return getData(b) - getData(a);
    });

    chosen = [data[201], data[150], data[106], data[97], data[88], data[68], data[41], data[17], data[1], data[0]];

    radiusScale = d3.scale.linear()
        .range([3,190])
        .domain(d3.extent(data, function(d){return getData(d);}));

    allData = [];

    allData.push(data.slice(0, 4));
    for (i = 4; i < 164;) {
        allData.push(data.slice(i, i + 20));
        i += 20;
        if (i >= 164) {
            allData.push(data.slice(start = i));
        }
    }
    allData = allData.reverse();

    var visNumber = 1;

    allData.forEach(function(d,index){
        footSteps.push(new FootStep("#footprint-vis" + visNumber, d, radiusScale));
        visNumber += 1;
    });

    fixedObj = new FootFixed("#fixed-footprints", chosen, radiusScale, meanTotal, meanPC);
}

function updateVisualization(){

    data = data.sort(function (a, b) {
        return getData(b) - getData(a);
    });

    chosen = chosen.sort(function (a, b) {
        return getData(a) - getData(b);
    });

    radiusScale = d3.scale.linear()
        .range([3,180])
        .domain(d3.extent(data, function(d){return getData(d);}));

    allData.push(data.slice(0, 4));
    for (i = 4; i < 164;) {
        allData.push(data.slice(i, i + 20));
        i += 20;
        if (i >= 164) {
            allData.push(data.slice(start = i));
        }
    }
    allData = allData.reverse();

    for(i=0;i<footSteps.length;i++){
        footSteps[i].updateVis(allData[i], radiusScale);
    }

    fixedObj.updateVis(chosen, radiusScale, stepNum);
}

function getData(country){
    var dataType = $('input[name="dataS"]:checked').val();
    return (dataType == "total") ? country.TotalRadius : country.PCRadius;
}


// Scrolling Functionality to determine position

var sections = d3.selectAll('.step');

sectionPositions = [];
var startPos;
sections.each(function(d,i) {
    var top = this.getBoundingClientRect().top;

    if(i === 0) {
        startPos = top;
    }
    sectionPositions.push(top - startPos);
});

d3.select(window)
    .on("scroll.scroller", position);

function position() {
    var pos = window.pageYOffset - 10;
    var sectionIndex = d3.bisect(sectionPositions, pos);
    sectionIndex = Math.min(sections.size() - 1, sectionIndex);

    stepNum = sectionIndex;
    fixedObj.updateVis(chosen, radiusScale, stepNum);
}