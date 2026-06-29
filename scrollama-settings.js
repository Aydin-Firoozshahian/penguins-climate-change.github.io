// Initialize the scrollama instance
var scroller = scrollama();

function handleStepEnter(response) {
    // response = { element, direction, index }
    let currentStep = d3.select(response.element);
    let stepId = currentStep.attr("data-step");
    
    // Toggle reading step highlights
    d3.selectAll(".step").classed("is-active", false);
    currentStep.classed("is-active", true);

    // Reset standard single graph visual states
    d3.selectAll(".graph-container").classed("is-active", false);
    d3.selectAll("#adelie-graphs-container .graph-container").classed("active-graph", false);

    // Context trigger actions
    switch(stepId) {
        case "intro-1":
            d3.select("#intro-graphs-container").classed("is-active", true);
            break;
        case "intro-2":
            d3.select("#intro-graphs-container").classed("is-active", true);
            // secondary progressive reveal adjustment
            d3.select("#intro-graphs-container img").style("transform", "scale(1.03) rotate(0.5deg)");
            break;
            
        case "seaice-1":
            d3.select("#seaice-graph-container").classed("is-active", true);
            break;
        case "seaice-2":
            d3.select("#seaice-graph-container").classed("is-active", true);
            d3.select("#seaice-graph-container img").style("transform", "scale(1.05) translateY(-10px)");
            break;
            
        case "emperor-1":
            d3.select("#emperor-graph-container").classed("is-active", true);
            break;
        case "emperor-2":
            d3.select("#emperor-graph-container").classed("is-active", true);
            d3.select("#emperor-graph-container img").style("filter", "brightness(1.1) contrast(1.05)");
            break;
            
        case "adelie-1":
            // Display first layout chart placeholder
            d3.select("#graph-1-container").classed("active-graph", true).classed("is-active", true);
            break;
        case "adelie-2":
            // Dynamically crossfades over to the second placeholder graph 
            d3.select("#graph-2-container").classed("active-graph", true).classed("is-active", true);
            break;
            
        case "conclusion-1":
            d3.select("#conclusion-graph-container").classed("is-active", true);
            break;
        case "conclusion-2":
            d3.select("#conclusion-graph-container").classed("is-active", true);
            d3.select("#conclusion-graph-container img").style("transform", "scale(1.05)");
            break;
            
        default:
            break;
    }
}

function handleStepExit(response) {
    if (response.direction === "up") {
        // Clear customized transform styles on backward upward scrolls
        d3.selectAll(".graph-container img").style("transform", null).style("filter", null);
    }
}

function init() {
    scroller
        .setup({
            step: ".step", // Track paragraph steps
            offset: 0.55,  // Triggers action at 55% from the viewport top
            debug: false   // Switch to true to overlay threshold lines
        })
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);

    window.addEventListener("resize", () => scroller.resize());
}

// Fire up scrollama
init();