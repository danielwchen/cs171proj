/*
 *  CongressVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

CongressVis = function(_parentElement, _senData, _repData, _eventHandler) {

    this.parentElement = _parentElement;
    this.senData = _senData;
    this.repData = _repData;
    this.eventHandler = _eventHandler;

    this.initVis();
};

CongressVis.prototype.initVis = function() {

    var vis = this;

    vis.margin = {top: 100, right: 30, bottom: 0, left: 10};
    vis.width = $(vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 1300 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // Scales and axes
    vis.x = d3.scale.linear()
        .range([0, vis.width]);

    vis.y = d3.scale.linear()
        .range([vis.height, 0]);

    vis.aisle = 40;

    vis.senHeight = 15;
    vis.senWidth = 20;
    vis.senPadding = 3;
    vis.senNumPerRow = 12;

    vis.repHeight = 9;
    vis.repWidth = 9;
    vis.repPadding = 3;
    vis.repNumPerRow = 23;

    vis.spaceBetweenSections = 20;

    vis.sortParam = d3.select(".form-control").property("value");

    vis.axisInfo = {
        CurrentAge: {numSenSections:6, numRepSections:6, rowsPerSection:2, repRowsPerSection:4},
        AgeAtTakingOfficeYear: {numSenSections:4, numRepSections:5, rowsPerSection:2, repRowsPerSection:4},
        YearsInOffice: {numSenSections:5, numRepSections:6, rowsPerSection:3, repRowsPerSection:8},
        YearNextElection: {numSenSections:3, numRepSections:1, rowsPerSection:3, repRowsPerSection:11},
        Party: {numSenSections:3, numRepSections:2, rowsPerSection:5, repRowsPerSection:11},
        State: {numSenSections:1, numRepSections:1, rowsPerSection:5, repRowsPerSection:11}
    };

    vis.axisPlacement = {
        sen: {
            CurrentAge: {Places:[0,0,1,1,2,2,3,3,4,4,5,5], Labels:["30-39","40-49","50-59","60-69","70-79","80-89"]},
            AgeAtTakingOfficeYear: {Places:[0,0,1,1,2,2,3,3], Labels:["30-39","40-49","50-59","60-69"]},
            YearsInOffice: {Places:[0,0,1,1,2,2,3,3,4,4], Labels:["0-9","10-19","20-29","30-39","40-49"]},
            YearNextElection: {Places:[0,0,1,1,2,2], Labels:["2018","2020","2022"]},
            Party: {Places:[0,0,1,1,2,2], Labels:["Dem","Rep","Ind"]},
            State: {Places:[0,0], Labels:["All"]}
        },
        rep: {
            CurrentAge: {Places:[0,0,1,1,2,2,3,3,4,4,5,5], Labels:["30-39","40-49","50-59","60-69","70-79","80-89"]},
            AgeAtTakingOfficeYear: {Places:[0,0,1,1,2,2,3,3,4,4], Labels:["30-39","40-49","50-59","60-69","70-79"]},
            YearsInOffice: {Places:[0,0,1,1,2,2,3,3,4,4,5,5], Labels:["0-9","10-19","20-29","30-39","40-49","50-59"]},
            YearNextElection: {Places:[0,0], Labels:["2018"]},
            Party: {Places:[0,0,1,1], Labels:["Dem","Rep"]},
            State: {Places:[0,0], Labels:["All"]}
        }
    }

    vis.ySenSpacing = vis.axisInfo[vis.sortParam].rowsPerSection * (vis.senHeight + vis.senPadding) + vis.spaceBetweenSections;
    vis.yRepSpacing = vis.axisInfo[vis.sortParam].repRowsPerSection * (vis.repHeight + vis.repPadding) + vis.spaceBetweenSections;


    vis.senateLabel = vis.svg.append("text")
        .attr("class","congress-label")
        .text("Senate")
        .attr("text-anchor","middle")
        .attr("y",-10)
        .attr("x",vis.width / 2 + vis.senWidth/2);

    vis.houseLabel = vis.svg.append("text")
        .attr("class","congress-label")
        .text("House of Representatives")
        .attr("text-anchor","middle")
        .attr("y",vis.ySenSpacing * vis.axisInfo[vis.sortParam].numSenSections + vis.spaceBetweenSections)
        .attr("x",vis.width / 2 + vis.senWidth/2);

    vis.svg.append("text")
        .attr("class","congress-title")
        .text("CHAMPIONS")
        // .attr("text-anchor","middle")
        .attr("y",-45)
        .attr("x",vis.width / 2 + vis.senWidth/2 - ((vis.senNumPerRow +1) * (vis.senWidth+vis.senPadding)));

    vis.svg.append("text")
        .attr("class","congress-title")
        .text("DENIERS")
        .attr("text-anchor","end")
        .attr("y",-45)
        .attr("x",vis.width / 2 + vis.senWidth/2 + ((vis.senNumPerRow +1) * (vis.senWidth+vis.senPadding)));

    vis.wrangleData();
};

CongressVis.prototype.resetCounters = function() {

    var vis = this;

    vis.bCounters = {};
    vis.dCounters = {};

    vis.allCounters = {"bCounters":vis.bCounters, "dCounters":vis.dCounters};
    vis.allCounters.bCounters['CurrentAge'] = {range3039:0, range4049:0, range5059:0, range6069:0, range7079:0, range8089:0};
    vis.allCounters.bCounters['AgeAtTakingOfficeYear'] = {range3039:0, range4049:0, range5059:0, range6069:0, range7079:0};
    vis.allCounters.bCounters['YearsInOffice'] = {range09:0, range1019:0, range2029:0, range3039:0, range4049:0, range5059:0};
    vis.allCounters.bCounters['YearNextElection'] = {"2018":0, "2020":0, "2022":0};
    vis.allCounters.bCounters['Party'] = {Democratic:0, Republican:0, Independent:0};
    vis.allCounters.bCounters['State'] = {State:0};

    vis.allCounters.dCounters['CurrentAge'] = {range3039:0, range4049:0, range5059:0, range6069:0, range7079:0, range8089:0};
    vis.allCounters.dCounters['AgeAtTakingOfficeYear'] = {range3039:0, range4049:0, range5059:0, range6069:0, range7079:0};
    vis.allCounters.dCounters['YearsInOffice'] = {range09:0, range1019:0, range2029:0, range3039:0, range4049:0, range5059:0};
    vis.allCounters.dCounters['YearNextElection'] = {"2018":0, "2020":0, "2022":0};
    vis.allCounters.dCounters['Party'] = {Democratic:0, Republican:0, Independent:0};
    vis.allCounters.dCounters['State'] = {State:0};

    // vis.counters.yearNextElection['2020'] += 5;
    // console.log(vis.counters.yearNextElection['2020']);

    // Current Age (6) 30-39 (1) 40-49 (13) 50-59 (25) 60-69 (38) 70-79 (15) 80-89 (7)
    // Age when taking office (4) 30-39 (5) 40-49 (33) 50-59 (40) 60-69 (21)
    // Years in office (5) 0-9 (59) 10-19 (23) 20-29 (10) 30-39 (5) 40-49 (2)
    // Year of next election (3) 2018 (33) 2020 (33) 2022 (33)
    // Party Dem (46) Independent (2) Rep (51)

};

CongressVis.prototype.getSenX = function(d) {

    var vis = this;

    if (d.ranking[0] == 'believe') {
        return vis.width / 2 - vis.aisle - (d.ranking[2] % vis.senNumPerRow) * (vis.senWidth + vis.senPadding);
    } else {
        return vis.width / 2 + vis.aisle + (d.ranking[2] % vis.senNumPerRow) * (vis.senWidth + vis.senPadding);
    }

    // Current Age (6) 30-39 (1) 40-49 (13) 50-59 (25) 60-69 (38) 70-79 (15) 80-89 (7)
    // Age when taking office (4) 30-39 (5) 40-49 (33) 50-59 (40) 60-69 (21)
    // Years in office (5) 0-9 (59) 10-19 (23) 20-29 (10) 30-39 (5) 40-49 (2)
    // Year of next election (3) 2018 (33) 2020 (33) 2022 (33)
    // Party Dem (46) Independent (2) Rep (51)

};

CongressVis.prototype.getSenY = function(d) {

    var vis = this;

    return Math.floor(d.ranking[2] / vis.senNumPerRow) * (vis.senHeight + vis.senPadding) + vis.ySenSpacing * d.ranking[1];

    // Current Age (6) 30-39 (1) 40-49 (13) 50-59 (25) 60-69 (38) 70-79 (15) 80-89 (7)
    // Age when taking office (4) 30-39 (5) 40-49 (33) 50-59 (40) 60-69 (21)
    // Years in office (5) 0-9 (59) 10-19 (23) 20-29 (10) 30-39 (5) 40-49 (2)
    // Year of next election (3) 2018 (33) 2020 (33) 2022 (33)
    // Party Dem (46) Independent (2) Rep (51)

};

CongressVis.prototype.getRepX = function(d) {

    var vis = this;

    if (d.ranking[0] == 'believe') {
        return vis.width / 2 + vis.senWidth - vis.repWidth - vis.aisle - (d.ranking[2] % vis.repNumPerRow) * (vis.repWidth + vis.repPadding);
    } else {
        return vis.width / 2 + vis.aisle + (d.ranking[2] % vis.repNumPerRow) * (vis.repWidth + vis.repPadding);
    }

};

CongressVis.prototype.getRepY = function(d) {

    var vis = this;

    return Math.floor(d.ranking[2] / vis.repNumPerRow) * (vis.repHeight + vis.repPadding) + vis.yRepSpacing * d.ranking[1] + vis.ySenSpacing * vis.axisInfo[vis.sortParam].numSenSections + 30;
};

CongressVis.prototype.wrangleData = function() {
    var vis = this;

    vis.sortParam = d3.select(".form-control").property("value")

    vis.senData = vis.senData.sort(function(a, b) {
        return sortByVar(a.Name, b.Name);
    });


    vis.senData = vis.senData.sort(function(a, b) {
        return sortByVar(a.State, b.State);
    });
    if (vis.sortParam != "State") {
        vis.senData = vis.senData.sort(function(a, b) {
            return sortByVar(b[vis.sortParam],a[vis.sortParam]);
        });
    }


    vis.resetCounters();
    vis.senData.forEach(function(d) {
        vis.assignRanking(d);
    });
    vis.ySenSpacing = vis.axisInfo[vis.sortParam].rowsPerSection * (vis.senHeight + vis.senPadding) + vis.spaceBetweenSections;

    vis.repData = vis.repData.sort(function(a, b) {
        return sortByVar(a.Name, b.Name);
    });


    vis.repData = vis.repData.sort(function(a, b) {
        return sortByVar(a.State, b.State);
    });
    if (vis.sortParam != "State") {
        vis.repData = vis.repData.sort(function(a, b) {
            return sortByVar(b[vis.sortParam],a[vis.sortParam]);
        });
    }


    vis.resetCounters();
    vis.repData.forEach(function(d) {
        vis.assignRanking(d);
    });
    vis.yRepSpacing = vis.axisInfo[vis.sortParam].repRowsPerSection * (vis.repHeight + vis.repPadding) + vis.spaceBetweenSections;


    vis.updateVis();

};

CongressVis.prototype.assignRanking = function(d) {
    var vis = this;
    vis.temp = d[vis.sortParam];
    d.ranking = [];
    if (d.BelieveClimateChange == "Yes") {
        d.ranking[0] = 'believe';
        switch (vis.sortParam) {
            case 'CurrentAge':
                if (vis.temp < 40) {
                    d.ranking[1] = 0;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range3039;
                    vis.allCounters.bCounters[vis.sortParam].range3039 += 1;
                } else if (vis.temp < 50) {
                    d.ranking[1] = 1;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range4049;
                    vis.allCounters.bCounters[vis.sortParam].range4049 += 1;
                } else if (vis.temp < 60) {
                    d.ranking[1] = 2;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range5059;
                    vis.allCounters.bCounters[vis.sortParam].range5059 += 1;
                } else if (vis.temp < 70) {
                    d.ranking[1] = 3;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range6069;
                    vis.allCounters.bCounters[vis.sortParam].range6069 += 1;
                } else if (vis.temp < 80) {
                    d.ranking[1] = 4;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range7079;
                    vis.allCounters.bCounters[vis.sortParam].range7079 += 1;
                } else if (vis.temp < 90) {
                    d.ranking[1] = 5;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range8089;
                    vis.allCounters.bCounters[vis.sortParam].range8089 += 1;
                }
                // Current Age (6) 30-39 (1) 40-49 (13) 50-59 (25) 60-69 (38) 70-79 (15) 80-89 (7)
                break;
            case 'AgeAtTakingOfficeYear':
                if (vis.temp < 40) {
                    d.ranking[1] = 0;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range3039;
                    vis.allCounters.bCounters[vis.sortParam].range3039 += 1;
                } else if (vis.temp < 50) {
                    d.ranking[1] = 1;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range4049;
                    vis.allCounters.bCounters[vis.sortParam].range4049 += 1;
                } else if (vis.temp < 60) {
                    d.ranking[1] = 2;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range5059;
                    vis.allCounters.bCounters[vis.sortParam].range5059 += 1;
                } else if (vis.temp < 70) {
                    d.ranking[1] = 3;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range6069;
                    vis.allCounters.bCounters[vis.sortParam].range6069 += 1;
                } else if (vis.temp < 80) {
                    d.ranking[1] = 4;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range7079;
                    vis.allCounters.bCounters[vis.sortParam].range7079 += 1;
                }
                // Age when taking office (4) 30-39 (5) 40-49 (33) 50-59 (40) 60-69 (21)
                break;
            case 'YearsInOffice':
                if (vis.temp < 10) {
                    d.ranking[1] = 0;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range09;
                    vis.allCounters.bCounters[vis.sortParam].range09 += 1;
                } else if (vis.temp < 20) {
                    d.ranking[1] = 1;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range1019;
                    vis.allCounters.bCounters[vis.sortParam].range1019 += 1;
                } else if (vis.temp < 30) {
                    d.ranking[1] = 2;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range2029;
                    vis.allCounters.bCounters[vis.sortParam].range2029 += 1;
                } else if (vis.temp < 40) {
                    d.ranking[1] = 3;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range3039;
                    vis.allCounters.bCounters[vis.sortParam].range3039 += 1;
                } else if (vis.temp < 50) {
                    d.ranking[1] = 4;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range4049;
                    vis.allCounters.bCounters[vis.sortParam].range4049 += 1;
                } else if (vis.temp < 60) {
                    d.ranking[1] = 5;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range5059;
                    vis.allCounters.bCounters[vis.sortParam].range5059 += 1;
                }
                // Years in office (5) 0-9 (59) 10-19 (23) 20-29 (10) 30-39 (5) 40-49 (2)
                break;
            case 'YearNextElection':
                if (vis.temp == 2018) {
                    d.ranking[1] = 0;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam]['2018'];
                    vis.allCounters.bCounters[vis.sortParam]['2018'] += 1;
                } else if (vis.temp == 2020) {
                    d.ranking[1] = 1;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam]['2020'];
                    vis.allCounters.bCounters[vis.sortParam]['2020'] += 1;
                } else if (vis.temp == 2022) {
                    d.ranking[1] = 2;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam]['2022'];
                    vis.allCounters.bCounters[vis.sortParam]['2022'] += 1;
                }
                // Year of next election (3) 2018 (33) 2020 (33) 2022 (33)
                break;
            case 'Party':
                if (vis.temp == 'Democratic') {
                    d.ranking[1] = 0;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam]['Democratic'];
                    vis.allCounters.bCounters[vis.sortParam]['Democratic'] += 1;
                } else if (vis.temp == 'Republican') {
                    d.ranking[1] = 1;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam]['Republican'];
                    vis.allCounters.bCounters[vis.sortParam]['Republican'] += 1;
                } else if (vis.temp == 'Independent') {
                    d.ranking[1] = 2;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam]['Independent'];
                    vis.allCounters.bCounters[vis.sortParam]['Independent'] += 1;
                }
                // Party Dem (46) Independent (2) Rep (51)
                break;
            case 'State':
                d.ranking[1] = 0;
                d.ranking[2] = vis.allCounters.bCounters[vis.sortParam]['State'];
                vis.allCounters.bCounters[vis.sortParam]['State'] += 1;
        }
    } else {
        d.ranking[0] = 'deny';
        switch (vis.sortParam) {
            case 'CurrentAge':
                if (vis.temp < 40) {
                    d.ranking[1] = 0;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range3039;
                    vis.allCounters.dCounters[vis.sortParam].range3039 += 1;
                } else if (vis.temp < 50) {
                    d.ranking[1] = 1;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range4049;
                    vis.allCounters.dCounters[vis.sortParam].range4049 += 1;
                } else if (vis.temp < 60) {
                    d.ranking[1] = 2;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range5059;
                    vis.allCounters.dCounters[vis.sortParam].range5059 += 1;
                } else if (vis.temp < 70) {
                    d.ranking[1] = 3;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range6069;
                    vis.allCounters.dCounters[vis.sortParam].range6069 += 1;
                } else if (vis.temp < 80) {
                    d.ranking[1] = 4;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range7079;
                    vis.allCounters.dCounters[vis.sortParam].range7079 += 1;
                } else if (vis.temp < 90) {
                    d.ranking[1] = 5;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range8089;
                    vis.allCounters.dCounters[vis.sortParam].range8089 += 1;
                }
                // Current Age (6) 30-39 (1) 40-49 (13) 50-59 (25) 60-69 (38) 70-79 (15) 80-89 (7)
                break;
            case 'AgeAtTakingOfficeYear':
                if (vis.temp < 40) {
                    d.ranking[1] = 0;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range3039;
                    vis.allCounters.dCounters[vis.sortParam].range3039 += 1;
                } else if (vis.temp < 50) {
                    d.ranking[1] = 1;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range4049;
                    vis.allCounters.dCounters[vis.sortParam].range4049 += 1;
                } else if (vis.temp < 60) {
                    d.ranking[1] = 2;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range5059;
                    vis.allCounters.dCounters[vis.sortParam].range5059 += 1;
                } else if (vis.temp < 70) {
                    d.ranking[1] = 3;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range6069;
                    vis.allCounters.dCounters[vis.sortParam].range6069 += 1;
                } else if (vis.temp < 80) {
                    d.ranking[1] = 4;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range7079;
                }
                // Age when taking office (4) 30-39 (5) 40-49 (33) 50-59 (40) 60-69 (21)
                break;
            case 'YearsInOffice':
                if (vis.temp < 10) {
                    d.ranking[1] = 0;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range09;
                    vis.allCounters.dCounters[vis.sortParam].range09 += 1;
                } else if (vis.temp < 20) {
                    d.ranking[1] = 1;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range1019;
                    vis.allCounters.dCounters[vis.sortParam].range1019 += 1;
                } else if (vis.temp < 30) {
                    d.ranking[1] = 2;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range2029;
                    vis.allCounters.dCounters[vis.sortParam].range2029 += 1;
                } else if (vis.temp < 40) {
                    d.ranking[1] = 3;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range3039;
                    vis.allCounters.dCounters[vis.sortParam].range3039 += 1;
                } else if (vis.temp < 50) {
                    d.ranking[1] = 4;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam].range4049;
                    vis.allCounters.dCounters[vis.sortParam].range4049 += 1;
                } else if (vis.temp < 60) {
                    d.ranking[1] = 5;
                    d.ranking[2] = vis.allCounters.bCounters[vis.sortParam].range5059;
                    vis.allCounters.bCounters[vis.sortParam].range5059 += 1;
                }
                // Years in office (5) 0-9 (59) 10-19 (23) 20-29 (10) 30-39 (5) 40-49 (2)
                break;
            case 'YearNextElection':
                if (vis.temp == 2018) {
                    d.ranking[1] = 0;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam]['2018'];
                    vis.allCounters.dCounters[vis.sortParam]['2018'] += 1;
                } else if (vis.temp == 2020) {
                    d.ranking[1] = 1;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam]['2020'];
                    vis.allCounters.dCounters[vis.sortParam]['2020'] += 1;
                } else if (vis.temp == 2022) {
                    d.ranking[1] = 2;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam]['2022'];
                    vis.allCounters.dCounters[vis.sortParam]['2022'] += 1;
                }
                // Year of next election (3) 2018 (33) 2020 (33) 2022 (33)
                break;
            case 'Party':
                if (vis.temp == 'Democratic') {
                    d.ranking[1] = 0;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam]['Democratic'];
                    vis.allCounters.dCounters[vis.sortParam]['Democratic'] += 1;
                } else if (vis.temp == 'Republican') {
                    d.ranking[1] = 1;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam]['Republican'];
                    vis.allCounters.dCounters[vis.sortParam]['Republican'] += 1;
                } else if (vis.temp == 'Independent') {
                    d.ranking[1] = 2;
                    d.ranking[2] = vis.allCounters.dCounters[vis.sortParam]['Independent'];
                    vis.allCounters.dCounters[vis.sortParam]['Independent'] += 1;
                }
                // Party Dem (46) Independent (2) Rep (51)
                break;
            case 'State':
                d.ranking[1] = 0;
                d.ranking[2] = vis.allCounters.dCounters[vis.sortParam]['State'];
                vis.allCounters.dCounters[vis.sortParam]['State'] += 1;
        }
    }


};

CongressVis.prototype.updateVis = function() {
    var vis = this;

    vis.houseLabel.transition().duration(800)
        .attr("y",vis.ySenSpacing * vis.axisInfo[vis.sortParam].numSenSections + vis.spaceBetweenSections);

    vis.senLines = vis.svg.selectAll(".senLines")
        .data(vis.axisPlacement.sen[vis.sortParam].Places);

    vis.senLines.enter().append("line")
        .attr("class","senLines")
        .attr("x1", function(d,index) {
            if (index % 2 == 1) {
                return vis.width/2 + vis.senWidth/2 - vis.aisle/2 - 5
            } else {
                return vis.width/2 + vis.senWidth/2 + vis.aisle/2 + 5
            }
        })
        .attr("x2", function(d,index) {
            if (index % 2 == 1) {
                return vis.width/2 + vis.senWidth/2 - vis.aisle/2 - 5
            } else {
                return vis.width/2 + vis.senWidth/2 + vis.aisle/2 + 5
            }
        })
        .attr("stroke","black")
        .attr("stroke-width",5);

    vis.senLines.transition().duration(500)
        .attr("y1", function(d) {
            return vis.ySenSpacing * d;
        })
        .attr("y2", function (d) {
            return vis.ySenSpacing * d + vis.axisInfo[vis.sortParam].rowsPerSection * (vis.senHeight + vis.senPadding) - vis.senPadding;
        });

    vis.senLines.exit().remove();

    vis.repLines = vis.svg.selectAll(".repLines")
        .data(vis.axisPlacement.rep[vis.sortParam].Places);

    vis.repLines.enter().append("line")
        .attr("class","repLines")
        .attr("x1", function(d,index) {
            if (index % 2 == 1) {
                return vis.width/2 + vis.senWidth/2 - vis.aisle/2 - 5
            } else {
                return vis.width/2 + vis.senWidth/2 + vis.aisle/2 + 5
            }
        })
        .attr("x2", function(d,index) {
            if (index % 2 == 1) {
                return vis.width/2 + vis.senWidth/2 - vis.aisle/2 - 5
            } else {
                return vis.width/2 + vis.senWidth/2 + vis.aisle/2 + 5
            }
        })
        .attr("stroke","black")
        .attr("stroke-width",5);

    vis.repLines.transition().duration(500)
        .attr("y1", function(d) {
            return vis.yRepSpacing * d + vis.ySenSpacing * vis.axisInfo[vis.sortParam].numSenSections + 30;

        })
        .attr("y2", function (d) {
            return vis.yRepSpacing * d + vis.axisInfo[vis.sortParam].repRowsPerSection * (vis.repHeight + vis.repPadding) - vis.repPadding + vis.ySenSpacing * vis.axisInfo[vis.sortParam].numSenSections + 30;
        });

    vis.repLines.exit().remove();

    vis.senLabels = vis.svg.selectAll(".senLabels")
        .data(vis.axisPlacement.sen[vis.sortParam].Labels);

    vis.senLabels.enter().append("text")
        .attr("class","senLabels")
        .attr("text-anchor","middle")
        .attr("x", vis.width/2 + vis.senWidth/2);

    vis.senLabels.transition().duration(500)
        .text(function(d){
            return d;
        })
        .attr("y", function(d,index) {
            return vis.ySenSpacing * index + (vis.axisInfo[vis.sortParam].rowsPerSection * (vis.senHeight + vis.senPadding) - vis.senPadding)/2;
        });

    vis.senLabels.exit().remove();

    vis.repLabels = vis.svg.selectAll(".repLabels")
        .data(vis.axisPlacement.rep[vis.sortParam].Labels);

    vis.repLabels.enter().append("text")
        .attr("class","repLabels")
        .attr("text-anchor","middle")
        .attr("x", vis.width/2 + vis.senWidth/2);

    vis.repLabels.transition().duration(500)
        .text(function(d){
            return d;
        })
        .attr("y", function(d,index) {
            return vis.yRepSpacing * index + (vis.axisInfo[vis.sortParam].repRowsPerSection * (vis.repHeight + vis.repPadding) - vis.repPadding)/2 + vis.ySenSpacing * vis.axisInfo[vis.sortParam].numSenSections + 30;
        });

    vis.repLabels.exit().remove();

    vis.senTip = d3.tip().attr('class', 'd3-tip').html(function(d) {
        return d.Party + " Sen " + d.Name + ", " + d.State + ", " + vis.sortParam + ": " + d[vis.sortParam];
    }).offset([-5,0]);
    
    vis.senIcons = vis.svg.selectAll(".senIcons")
        .data(vis.senData, function(d) { return d.Name });

    // Add
    vis.senIcons.enter().append("rect")
        .attr("class", "senIcons")
        .attr("fill", function (d) {
            if (d.Party == "Republican") {
                return "red";
            } else if (d.Party == "Democratic") {
                return "blue";
            } else { return "green" }
        })
        // .attr("rx", 3)
        // .attr("ry", 3)
        .attr("width", vis.senWidth)
        .attr("height", vis.senHeight)

    // Update
    vis.senIcons
        .transition().duration(800)
        .attr("x", function(d) {
            // Some complicated function
            // return 30 + vis.width/2 + (index % vis.senNumPerRow) * (vis.senWidth + vis.senPadding);
            return vis.getSenX(d);
        })
        .attr("y", function(d) {
            // // Some complicated function
            return vis.getSenY(d);
        });

    vis.senIcons
        .on("mouseover",function(d) {
            $(vis.eventHandler).trigger("repOver", d.Name);
        })
        .on("mouseout",function(d) {
            $(vis.eventHandler).trigger("repOff");
        })
        .on("click",function(d) {
            $(vis.eventHandler).trigger("repPress", d.Name);
        });
        // .on('mouseover', vis.senTip.show)
        // .on('mouseout', vis.senTip.hide);

    // Remove
    vis.senIcons.exit().remove();

    // Invoke tooltip
    vis.senIcons.call(vis.senTip);

    vis.repTip = d3.tip().attr('class', 'd3-tip').html(function(d) {
        return d.Party + " Rep " + d.Name + ", " + d.State + ", " + vis.sortParam + ": " + d[vis.sortParam];
    }).offset([-5,0]);

    vis.repIcons = vis.svg.selectAll(".repIcons")
        .data(vis.repData, function(d) { return d.Name });

    // Add
    vis.repIcons.enter().append("rect")
        .attr("class", "repIcons")
        .attr("fill", function (d) {
            if (d.Party == "Republican") {
                return "red";
            } else if (d.Party == "Democratic") {
                return "blue";
            } else { return "green" }
        })
        // .attr("rx", 3)
        // .attr("ry", 3)
        .attr("width", vis.repWidth)
        .attr("height", vis.repHeight);

    // Update
    vis.repIcons
        .transition().duration(800)
        .attr("x", function(d) {
            // Some complicated function
            // return 30 + vis.width/2 + (index % vis.repNumPerRow) * (vis.repWidth + vis.repPadding);
            return vis.getRepX(d);
        })
        .attr("y", function(d) {
            // // Some complicated function
            return vis.getRepY(d);
        });

    vis.repIcons
        .on("mouseover",function(d) {
            $(vis.eventHandler).trigger("repOver", d.Name);
        })
        .on("mouseout",function(d) {
            $(vis.eventHandler).trigger("repOff");
        })
        .on("click",function(d) {
            $(vis.eventHandler).trigger("repPress", d.Name);
        });
        // .on('mouseover', vis.repTip.show)
        // .on('mouseout', vis.repTip.hide);

    // Remove
    vis.repIcons.exit().remove();

    // Invoke tooltip
    vis.repIcons.call(vis.repTip);


    d3.select(".form-control")
        .on("change", function() {
            vis.wrangleData();
        });
};

function compareStrings(a, b) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
}

function sortByVar(a, b) {
    if (typeof a == 'string') {
        return compareStrings(a,b);
    } else {
        return a - b;
    }

}

CongressVis.prototype.highlightState = function(state) {
    var vis = this;

    if (state) {
        vis.senIcons.transition().duration(80)
            .attr("fill",function(d) {
                if(d.State == state) {
                    if (d.Party == "Republican") {return "red"}
                    else if (d.Party == "Democratic") {
                        return "blue";
                    } else { return "green" }
                } else {
                    if (d.Party == "Republican") {return "#ff9696"}
                    else if (d.Party == "Democratic") {return "#9696ff"}
                    else { return "#96ff96"}
                }
            });
        vis.repIcons.transition().duration(80)
            .attr("fill",function(d) {
                if(d.State == state) {
                    if (d.Party == "Republican") {return "red"}
                    else if (d.Party == "Democratic") {
                        return "blue";
                    } else { return "green" }
                } else {
                    if (d.Party == "Republican") {return "#ff9696"}
                    else if (d.Party == "Democratic") {return "#9696ff"}
                    else { return "#96ff96"}
                }
            });
    } else {
        vis.senIcons.transition().duration(80)
            .attr("fill",function(d) {
                if (d.Party == "Republican") {return "red"}
                else if (d.Party == "Democratic") {
                    return "blue";
                } else { return "green" }
            });
        vis.repIcons.transition().duration(80)
            .attr("fill",function(d) {
                if (d.Party == "Republican") {return "red"}
                else if (d.Party == "Democratic") {
                    return "blue";
                } else { return "green" }
            });
    }
};

// CongressVis.prototype.pinState = function(state) {
//     var vis = this;
//
//     if (state) {
//         vis.senIcons.transition().duration(80)
//             .attr("fill",function(d) {
//                 if(d.State == state) {
//                     if (d.Party == "Republican") {return "red"}
//                     else if (d.Party == "Democratic") {
//                         return "blue";
//                     } else { return "green" }
//                 } else {
//                     if (d.Party == "Republican") {return "#ff9696"}
//                     else if (d.Party == "Democratic") {return "#9696ff"}
//                     else { return "#96ff96"}
//                 }
//             });
//         vis.repIcons.transition().duration(80)
//             .attr("fill",function(d) {
//                 if(d.State == state) {
//                     if (d.Party == "Republican") {return "red"}
//                     else if (d.Party == "Democratic") {
//                         return "blue";
//                     } else { return "green" }
//                 } else {
//                     if (d.Party == "Republican") {return "#ff9696"}
//                     else if (d.Party == "Democratic") {return "#9696ff"}
//                     else { return "#96ff96"}
//                 }
//             });
//     } else {
//         vis.senIcons.transition().duration(80)
//             .attr("fill",function(d) {
//                 if (d.Party == "Republican") {return "red"}
//                 else if (d.Party == "Democratic") {
//                     return "blue";
//                 } else { return "green" }
//             });
//         vis.repIcons.transition().duration(80)
//             .attr("fill",function(d) {
//                 if (d.Party == "Republican") {return "red"}
//                 else if (d.Party == "Democratic") {
//                     return "blue";
//                 } else { return "green" }
//             });
//     }
// };

CongressVis.prototype.highlightRep = function(rep) {
    var vis = this;

    if (rep) {
        vis.senIcons.transition().duration(120)
            .attr("fill",function(d) {
                if(d.Name == rep) {
                    if (d.Party == "Republican") {return "red"}
                    else if (d.Party == "Democratic") {
                        return "blue";
                    } else { return "green" }
                } else {
                    if (d.Party == "Republican") {return "#ff9696"}
                    else if (d.Party == "Democratic") {return "#9696ff"}
                    else { return "#96ff96"}
                }
            });
        vis.repIcons.transition().duration(120)
            .attr("fill",function(d) {
                if(d.Name == rep) {
                    if (d.Party == "Republican") {return "red"}
                    else if (d.Party == "Democratic") {
                        return "blue";
                    } else { return "green" }
                } else {
                    if (d.Party == "Republican") {return "#ff9696"}
                    else if (d.Party == "Democratic") {return "#9696ff"}
                    else { return "#96ff96"}
                }
            });
    } else {
        vis.senIcons.transition().duration(80)
            .attr("fill",function(d) {
                if (d.Party == "Republican") {return "red"}
                else if (d.Party == "Democratic") {
                    return "blue";
                } else { return "green" }
            });
        vis.repIcons.transition().duration(80)
            .attr("fill",function(d) {
                if (d.Party == "Republican") {return "red"}
                else if (d.Party == "Democratic") {
                    return "blue";
                } else { return "green" }
            });
    }

};