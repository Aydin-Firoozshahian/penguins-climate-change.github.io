// Set the margin and dimensions
const  margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right
    height = 400 - margin.top - margin.bottom;

// put the svg object for the visualization in the div container in the html
const svg = d3.select("#pg1-viz")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

// read the data (for CO2)

d3.text("data/CO2-line-chart.csv").then(
    function (text) {
        const filteredText = text.split("\n")
            .filter(line => !line.trim().startsWith("#"))
            .join("\n");
        
        console.log("Filtered text: " + filteredText);
        
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
            .call(d3.axisLeft(y));

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
    

// d3.csv("src/CO2-line-chart.csv",

//     // format the variables for the data in order to read it
//     function(d){
//     return { date : d3.timeParse("%Y-%m")(d.date), value : d.value }
//     }).then(
        
//         // Actually use the data to draw the graph
//         function(data) {

            
// })