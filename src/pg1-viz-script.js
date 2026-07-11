// Set the margin and dimensions
const  margin = {top: 60, right: 40, bottom: 40, left: 60},
    width = 460 - margin.left - margin.right
    height = 400 - margin.top - margin.bottom;

// put the svg object for the visualization in the div container in the html
const svg = d3.select("#intro-graphs-container")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width} ${height}`) // scale graph dimensions with dimensions of parent container (accounts for changes in window size)
        .style("overflow", "visible")
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Add the title
svg.append("text")
    .attr("x", (width / 2) - 12)
    .attr("y", 0 - (margin.top / 2))
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("padding", "10px")
    .text("Atmospheric CO2 and CH4 Concentrations (ppm/ppb), 2003-2026")

// Add the legend
const legendHeight = 0 - (margin.top / 2) + 20;
const lineMarkers = svg.append("g");
lineMarkers
    .append("line")
        .attr("x1", (width / 2) - margin.left - 60)
        .attr("x2", (width / 2) - margin.left - 35)
        .attr("y1", legendHeight)
        .attr("y2", legendHeight)
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
lineMarkers
    .append("line")
        .attr("x1", (width / 2) - margin.left + 60)
        .attr("x2", (width / 2) - margin.left + 85)
        .attr("y1", legendHeight)
        .attr("y2", legendHeight)
        .attr("stroke", "#B87333")
svg.append("text")
    .attr("x", (width / 2) - margin.left - 30)
    .attr("y", legendHeight+5)
    .style("color", "black")
    .text("CO2")
svg.append("text")
    .attr("x", (width / 2) - margin.left + 90)
    .attr("y", legendHeight+5)
    .style("color", "black")
    .text("CH4")

// Add the x axis and y axis labels

// X axis
svg.append("text")
    .attr("class", "axis-label x-axis-label")
    .attr("x", (width - margin.left - margin.right) / 2)
    .attr("y", height + margin.bottom - 5)
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Time (Years)")

// Y axis (CO2)
svg.append("text")
    .attr("class", "axis-label y-axis-label")
    .attr("x", -(margin.top + (height - margin.top - margin.bottom) / 2))
    .attr("y", margin.left - 100)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "steelblue")
    .text("CO2 Concentration (ppm)")

// Y Axis (CH4)
svg.append("text")
    .attr("class", "axis-label y-axis-label")
    .attr("x", margin.left + 100)
    .attr("y", -(margin.top + height + 50))
    .attr("transform", "rotate(90)")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#B87333")
    .text("CH4 Concentration (ppb)")

// read the data (for CO2)

d3.text("data/CO2-line-chart.csv").then(
    function (text) {
        // Remove the comments from the start of the file (lines that start with "#")
        const filteredText = text.split("\n")
            .filter(line => !line.trim().startsWith("#"))
            .join("\n");
                
        const data = d3.dsvFormat(";").parse(filteredText, function (d) {
            return {
                date : d3.timeParse("%Y-%m")(d.time.trim()),
                value : +d["level [ppm]"]
            };
        });

        // X axis (date format)
        const x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));
        
        // Y axis
        const y = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return +d.value; }))
            .range([ height, 0 ])
            .nice();
        svg.append("g")
            .call(d3.axisLeft(y))
            .style("color", "steelblue");

        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
                )       
    }
).catch(function(error) {
    console.error("Error loading or parsing CSV data: " + error);
});

// read the data for CH4

d3.text("data/CH4-line-chart.csv").then(
    function (text) {
        const filteredText = text.split("\n")
            .filter(line => !line.trim().startsWith("#"))
            .join("\n");
                
        const data = d3.dsvFormat(";").parse(filteredText, function (d) {
            return {
                date : d3.timeParse("%Y-%m")(d.time.trim()),
                value : +d["level [ppb]"]
            };
        });

        // X axis (date format)
        const x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([0, width]);
        
        // Y axis
        const y = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return +d.value; }))
            .range([ height, 0 ])
            .nice();
        svg.append("g")
            .attr("transform", `translate(${width}, 0)`)
            .call(d3.axisRight(y))
            .style("color", "#B87333");

        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#B87333")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
                )       
    }
).catch(function(error) {
    console.error("Error loading or parsing CSV data: " + error);
});
    

// d3.csv("src/CO2-line-chart.csv",

//     // format the variables for the data in order to read it
//     function(d){
//     return { date : d3.timeParse("%Y-%m")(d.date), value : d.value }
//     }).then(
        
//         // Actually use the data to draw the graph
//         function(data) {

            
// })