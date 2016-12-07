
var allData = [],
    footSteps = [],
    data;

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
        initVisualization();
    });

}

function initVisualization() {

    data = data.sort(function (a, b) {
        return getData(b) - getData(a);
    });

    var radiusScale = d3.scale.linear()
        .range([3,200])
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

    var visNumber = 1;
    allData.forEach(function(d){
        footSteps.push(new FootStep("#footprint-vis" + visNumber, d, radiusScale));
        visNumber += 1;
    });
}

function updateVisualization(){

    data = data.sort(function (a, b) {
        return getData(b) - getData(a);
    });

    var radiusScale = d3.scale.linear()
        .range([3,200])
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
}

function getData(country){
    var dataType = $('input[name="dataS"]:checked').val();
    return (dataType == "total") ? country.TotalRadius : country.PCRadius;
}


// Scrolling Functionality!

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

    console.log(sectionIndex);
}
