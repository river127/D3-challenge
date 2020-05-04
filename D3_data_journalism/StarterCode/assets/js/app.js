var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function (povertyData) {


    povertyData.forEach(function (data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });


    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(povertyData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(povertyData, d => d.healthcare)])
      .range([height, 0]);


    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
      .data(povertyData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "Red")
      .attr("opacity", ".9")
      .attr("stroke", "black")
      
      ;


    var text = chartGroup.selectAll()
      .data(povertyData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .text(function (d) { return d.abbr })
      .attr("fill", "black")
      .attr("font-size", "8px")
      
      ;

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
      });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
      toolTip.show(data, this);
    })

      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });

    var healthtext = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")  
      .text("Lack Health Care (%)");

      

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

     
  });