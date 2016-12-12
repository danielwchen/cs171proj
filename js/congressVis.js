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

    vis.margin = {top: 100, right: 10, bottom: 0, left: 30};
    vis.width = $(vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 2000 - vis.margin.top - vis.margin.bottom;

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

    vis.svg.append("text")
        .text("Climate Deniers")
        // .attr("text-anchor","middle")
        .attr("y",-15)
        .attr("x",vis.width * 3 / 4 - 50);

    vis.svg.append("text")
        .text("Climate Champions")
        // .attr("text-anchor","middle")
        .attr("y",-15)
        .attr("x",vis.width / 4);

    vis.svg.append("line")
        .attr("y1", vis.y(0))
        .attr("y2", vis.y(8*vis.senHeight))
        .attr("x1", vis.x(vis.width/2))
        .attr("x2", vis.x(vis.width/2))
        .attr("stroke","black")
        .attr("stroke-weight",2);

    vis.wrangleData();
};


CongressVis.prototype.resetCounters = function() {

    var vis = this;

    vis.bCounters = {};
    vis.dCounters = {};

    vis.allCounters = {"bCounters":vis.bCounters, "dCounters":vis.dCounters};
    vis.allCounters.bCounters['CurrentAge'] = {range3039:0, range4049:0, range5059:0, range6069:0, range7079:0, range8089:0, numSenSections:6, rowsPerSection:2, repRowsPerSection:4};
    vis.allCounters.bCounters['AgeAtTakingOfficeYear'] = {range3039:0, range4049:0, range5059:0, range6069:0, range7079:0, numSenSections:4, rowsPerSection:2, repRowsPerSection:4};
    vis.allCounters.bCounters['YearsInOffice'] = {range09:0, range1019:0, range2029:0, range3039:0, range4049:0, range5059:0, numSenSections:5, rowsPerSection:3, repRowsPerSection:8};
    vis.allCounters.bCounters['YearNextElection'] = {"2018":0, "2020":0, "2022":0, numSenSections:3, rowsPerSection:3, repRowsPerSection:9};
    vis.allCounters.bCounters['Party'] = {Democratic:0, Republican:0, Independent:0, numSenSections:3, rowsPerSection:4, repRowsPerSection:9};
    vis.allCounters.bCounters['State'] = {State:0, numSenSections:1, rowsPerSection:5, repRowsPerSection:9};

    vis.allCounters.dCounters['CurrentAge'] = {range3039:0, range4049:0, range5059:0, range6069:0, range7079:0, range8089:0, numSenSections:6, rowsPerSection:2, repRowsPerSection:4};
    vis.allCounters.dCounters['AgeAtTakingOfficeYear'] = {range3039:0, range4049:0, range5059:0, range6069:0, range7079:0, numSenSections:4, rowsPerSection:2, repRowsPerSection:4};
    vis.allCounters.dCounters['YearsInOffice'] = {range09:0, range1019:0, range2029:0, range3039:0, range4049:0, range5059:0, numSenSections:5, rowsPerSection:3, repRowsPerSection:8};
    vis.allCounters.dCounters['YearNextElection'] = {"2018":0, "2020":0, "2022":0, numSenSections:3, rowsPerSection:3, repRowsPerSection:9};
    vis.allCounters.dCounters['Party'] = {Democratic:0, Republican:0, Independent:0, numSenSections:3, rowsPerSection:4, repRowsPerSection:9};
    vis.allCounters.dCounters['State'] = {State:0, numSenSections:1, rowsPerSection:5, repRowsPerSection:9};

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

    // Current Age (6) 30-39 (1) 40-49 (13) 50-59 (25) 60-69 (38) 70-79 (15) 80-89 (7)
    // Age when taking office (4) 30-39 (5) 40-49 (33) 50-59 (40) 60-69 (21)
    // Years in office (5) 0-9 (59) 10-19 (23) 20-29 (10) 30-39 (5) 40-49 (2)
    // Year of next election (3) 2018 (33) 2020 (33) 2022 (33)
    // Party Dem (46) Independent (2) Rep (51)

};

CongressVis.prototype.getRepY = function(d) {

    var vis = this;

    return Math.floor(d.ranking[2] / vis.repNumPerRow) * (vis.repHeight + vis.repPadding) + vis.yRepSpacing * d.ranking[1] + vis.ySenSpacing * vis.allCounters.bCounters[vis.sortParam].numSenSections + 30;

    // Current Age (6) 30-39 (1) 40-49 (13) 50-59 (25) 60-69 (38) 70-79 (15) 80-89 (7)
    // Age when taking office (4) 30-39 (5) 40-49 (33) 50-59 (40) 60-69 (21)
    // Years in office (5) 0-9 (59) 10-19 (23) 20-29 (10) 30-39 (5) 40-49 (2)
    // Year of next election (3) 2018 (33) 2020 (33) 2022 (33)
    // Party Dem (46) Independent (2) Rep (51)

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
    vis.ySenSpacing = vis.allCounters.bCounters[vis.sortParam].rowsPerSection * (vis.senHeight + vis.senPadding) + vis.spaceBetweenSections;

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
    vis.yRepSpacing = vis.allCounters.bCounters[vis.sortParam].repRowsPerSection * (vis.repHeight + vis.repPadding) + vis.spaceBetweenSections;


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
        .attr("height", vis.senHeight);

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
        .on('mouseover', vis.senTip.show)
        .on('mouseout', vis.senTip.hide);

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
        .on('mouseover', vis.repTip.show)
        .on('mouseout', vis.repTip.hide);

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

CongressVis.prototype.onStateOver = function(state) {
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

CongressVis.prototype.pinState = function(state) {
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