

var slider = d3.slider();

slider.value(1860);
slider.axis(true).min(1860).max(2012).step(1);

slider.on("slide", function(evt, value) {
    d3.select('#slidertext').text(value);
    recordMap.year = value;
    recordMap.wrangleData();
})


d3.select('#slider').call(slider);