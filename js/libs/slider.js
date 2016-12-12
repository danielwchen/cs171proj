

slider.value(1820);
slider.axis(true).min(1820).max(2012).step(1);

slider.on("slide", function(evt, value) {
    d3.select('#slidertext').text(value);
    recordMap.year = value;
    recordMap.wrangleData();
    updateYear();
})


d3.select('#slider').call(slider);