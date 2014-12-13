// Get our data ready
queue()
  .defer(d3.json, "../data/ca_counties.json")
  .defer(d3.csv, "../data/traffic.csv")
  .await(ready);

var width = 1055,
    height = 600,
    margin = {left: 50, right: 50, bottom: 50, top: 50};

var radius = d3.scale.sqrt()
    .domain([0, 6])
    .range([1, 5]);

var color = d3.scale.category20();

var projection = d3.geo.azimuthalEqualArea()
    .center([0, 37.30])
    .rotate([122.0, 0])
    .scale(3200 * 15)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(2);

var svg = d3.select("#viz").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height);

function ready(error, ca_counties, commute) {

  svg.selectAll(".subunit")
    .data(topojson.feature(ca_counties, ca_counties.objects.subunits).features)
  .enter().append("path")
    .attr("class", function(d) { return "subunit" + d.id; })
    .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(ca_counties, ca_counties.objects.subunits, function(a, b) { return a !== b }))
    .attr("d", path)
    .attr("class", "subunit-boundary");

  // Printing county names
  svg.selectAll(".subunit-label")
    .data(topojson.feature(ca_counties, ca_counties.objects.subunits).features)
  .enter().append("text")
    .attr("class", function(d) { return "subunit-label " + d.id; })
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.properties.name + " County"; });

    bars = svg.selectAll("g")
    .data(commute)
  .enter().append("g")
    .attr("class","bars")
    .attr("transform",function(d) { return "translate(" + projection([d.end_longitude, d.end_latitude]) + ")";});

    /*
    bars.append("rect")
    .attr("height", function(d) { return d.amount / 2})
    .attr("width", 10)
    .attr("y", function(d) { return -(d.amount)})
    .attr("class", "bars")
    .style("fill", "green")
    .style("stroke", "white")
    .style("opacity", .4)
    .style("stroke-width", .8);
    */

    bars.append("text")
    .text(function(d) { return d.work })
    .attr("x", -10)
    .attr("y", 18);

    svg.append("g")
    .attr("class", "bubble")
    .selectAll("circle")
      .data(commute)
        .sort(function(a, b) { return b.amount - a.amount; })
    .enter().append("circle")
      .attr("r", function(d) { return radius(d.amount); })
      .attr("transform", function(d) { return "translate(" + projection([d.end_longitude, d.end_latitude]) + ")" })
      .style("fill", function(d) { return color(d.work); });

//    var legend = svg.append("g")
//        .attr("class", "legend")
//        .attr("transform", "translate(" + (width - 850) + "," + (height - 20) + ")")
//      .selectAll("g")
//        .data([150, 750, 2000])
//      .enter().append("g");

//    legend.append("circle")
//        .attr("cy", function(d) { return -radius(d); })
//        .attr("r", radius);

//    legend.append("text")
//        .attr("y", function(d) { return -2 * radius(d); })
//        .attr("dy", "1.3em")
//        .text(d3.format(".1s"));
};
