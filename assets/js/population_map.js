queue()
  .defer(d3.json, "/data/ca-counties/ca_counties.json")
  .defer(d3.csv, "/data/census-population/city_population.csv")
  .await(ready);

$("#slider").slider({
	value:1960,
	min: 1940,
	max: 2010,
	step: 1,
	slide: function( event, ui ) {
		$("#year").val(ui.value);
		redraw(ui.value.toString());
	}
});

$("#year").val($("#slider").slider("value") );

var width = 1055,
    height = 600,
    margin = {top: 50, left: 50, bottom: 50, right: 50};

var projection = d3.geo.azimuthalEqualArea()
      .center([0, 37.30])
      .rotate([122.0, 0])
      .scale(3200 * 15)
      .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#graph").insert("svg")
  .attr("width", width)
  .attr("height", height);

var states = svg.append("g")
    .attr("id", "states");

var circles = svg.append("g")
    .attr("id", "circles");

var labels = svg.append("g")
    .attr("id", "labels");

function ready(error, ca_counties, population) {

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

  var scalefactor=1/2000;

  circles.selectAll("circle")
    .data(population)
  .enter().append("circle")
    .attr("cx", function(d, i) { return projection([+d["longitude"], +d["latitude"]])[0]; })
    .attr("cy", function(d, i) { return projection([+d["longitude"], +d["latitude"]])[1]; })
    .attr("r", function(d) { return (+d["1990"]) * scalefactor; })
    .attr("title", function(d) { return d["city"] + Math.round(d["1990"]); });

  labels.selectAll("labels")
    .data(population)
  .enter().append("text")
    .attr("x", function(d, i) { return projection([+d["longitude"],+d["latitude"]])[0]; })
    .attr("y", function(d, i) { return projection([+d["longitude"],+d["latitude"]])[1]; })
    .attr("dy", "0.3em")
    .attr("text-anchor", "middle")
    .text(function(d) { return Math.round(d["1990"]); });
}

function redraw(year) {
  circles.selectAll("circle")
.transition()
  .duration(1000).ease("linear")
  .attr("r", function(d) { return (+d[year]) * scalefactor; })
  .attr("title", function(d) { return d["city"]+": "+Math.round(d[year]); });

  labels.selectAll("text")
    .text(function(d) { return Math.round(d[year]); });
}

