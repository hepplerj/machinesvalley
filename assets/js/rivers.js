// Get our data ready
queue()
  .defer(d3.json, "/data/ca-counties/ca_counties.json")
  .defer(d3.json, "/data/sv-rivers/bay-rivers.json")
  .defer(d3.json, "/data/ca-openspace/openspace_santaclara.json")
  .defer(d3.csv, "/data/ca-pollution/ca_superfund.csv")
  .defer(d3.csv, "/data/ca-pollution/ca_toxic_sites.csv")
  .defer(d3.json, "/data/sv-urban/urban_areas_out.json")
  .await(ready);

var width = 1055,
    height = 600,
    margin = {left: 50, right: 50, bottom: 50, top: 50};

var radius = d3.scale.sqrt()
    .domain([0, 6])
    .range([1, 5]);

var color = d3.scale.category20b();

var projection = d3.geo.azimuthalEqualArea()
    .center([0, 37.30])
    .rotate([122.0, 0])
    .scale(3600 * 20)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#viz").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height);

function ready(error, ca_counties, rivers, openspace, superfund, toxics, urban_areas) {

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

  svg.selectAll(".rivers")
    .data(topojson.feature(rivers, rivers.objects.bay).features)
  .enter().append("path")
    .attr("d", path)
    .attr("class", "rivers")
    .style("fill", "none")
    .style("stroke", "#0092B2");

  svg.selectAll(".urban_areas")
      .data(topojson.feature(urban_areas, urban_areas.objects.urban_areas).features)
    .enter().append("path")
      .style("fill", function(d,i) { return color(d.id); })
      .style("stroke", function(d,i) { return d3.lab(color(d.id)).darker(); })
      .attr("class", "urbanarea-poly")
      .attr("d", path)
      .style("opacity", "0.3");

  svg.selectAll(".openspace")
      .data(topojson.feature(openspace, openspace.objects.units_sc).features)
    .enter().append("path")
      .attr("class", "openspace-poly")
      .style("fill", "#333")
      .style("stroke", "white")
      .style("stroke-width", "0.3")
      .attr("d", path)
      .style("opacity", "0.5");

  superfund_sites = svg.selectAll(".superfund")
    .data(superfund)
  .enter().append("g")
    .attr("class", "superfund")
    .attr("transform", function(d) { return "translate(" + projection([d.longitude, d.latitude]) + ")"; });

  superfund_sites
    .append("circle")
    .attr("r", 8.5)
    .attr("class", "superfund-circ");

  toxic_sites = svg.selectAll(".toxics")
    .data(toxics)
  .enter().append("g")
    .attr("class", "toxics")
    .attr("transform", function(d) { return "translate(" + projection([d.longitude, d.latitude]) + ")"; });

  toxic_sites
    .append("circle")
    .attr("r", 4.5)
    .attr("class", "toxics-circ");

  };

function filterPoints(pointData) {
  if(d3.selectAll(pointData).style("display") == "none") {
    d3.selectAll(pointData).style("display", "block")
  } else {
  d3.selectAll(pointData).style("display", "none")
  }
}
