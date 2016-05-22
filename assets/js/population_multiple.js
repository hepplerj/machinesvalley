var margin = {top: 30, right: 10, bottom: 20, left: 50},
    width = 120 - margin.left - margin.right,
    height = 90 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width])

var y = d3.scale.linear()
    .range([height, 0])

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(3)
    .tickFormat(d3.time.format("'%y"))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(3)
    .tickFormat(d3.format("s"))
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.population); });

function compare(a,b) {
  if (a.key < b.key)
     return -1;
  if (a.key > b.key)
    return 1;
  return 0;
}

d3.csv("/data-files/census-population/population_counties.csv", function(error, data) {
    data.forEach(function(d) {
      d.population = +d.population;
      d.year = parseDate(d.year);
    });

    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.population; })]);

    var nested = d3.nest()
      .key(function(d) { return d.county; })
      .entries(data);

    nested = nested.sort(compare);

    var plots = d3.select("#viz").selectAll("div")
      .data(nested)
    .enter().append("div")
      .attr("class", "containers")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    plots.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    plots.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    plots.append("path")
      .datum(function(d) {
        return d.values;
      })
      .attr("class", "line")
      .attr("d", line);

    plots.append("text")
      .attr("transform", "translate(" + (width/2) + ",-5)")
      .attr("text-anchor","middle")
      .attr("class", "county-labels")
      .text(function(d) { return d.key; });

});