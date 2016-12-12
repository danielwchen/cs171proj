
var counter = 0;

function introduction(){
    var introText = [
        "Sure, the graph is true, but it starts to lose it's power after awhile... \n (click again)",
        "Climate change has NOT lost any power.",
        "With each passing year we move closer to the edge of the cliff.",
        "We can't afford to forget.",
        "That's why we decided to make something a bit more interesting...",
        "Click the arrow on the right to learn more."
    ];

    if (counter < introText.length){
        document.getElementById("introduction").innerHTML = introText[counter];
        counter += 1;
    }
}
