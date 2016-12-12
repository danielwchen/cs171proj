slider.value(50);
slider.axis(true).min(0).max(100).step(1);

slider.on("slide", function(evt, value) {
    d3.select('#slidertext').text(value);
    updateBar();
})


d3.select('#sliderpercent').call(slider);