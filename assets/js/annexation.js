queue()
  .defer(d3.json, "/data-files/ca-counties/ca_counties.json")
  .defer(d3.json, "/data-files/sv-annexations/sj_annexations.json")
  .defer(d3.json, "/data-files/sv-urban/urban_areas_out.json")
  .defer(d3.csv, "/data-files/sv-urban/ca-cities.csv")
  .await(ready);

var margin = {top: 50, right: 50, bottom: 50, left: 50},
width = 860,
height = 500,
sliderHeight = 20,
sliderWidth = 600,
active = d3.select(null),
data = {},
densityFormat = d3.format(",.2f"),
percentageFormat = d3.format(".2%");

// census data coming...
var maps = {
  "bayPopulation": {
    "field": "bayPopulation",
    "label": "San Jose annexations"
  }
};

var current = { "year": 1850, "map": maps.bayPopulation };

var svg = d3.select("#map").append("svg")
.attr("width", width + margin.right + margin.left)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var loading = svg.append("text")
.attr("x", width / 2)
.attr("y", height / 2)
.attr("text-anchor", "middle")
.text("Loading the map ...");

// Year slider
var sliderContainer = d3.select("#slider").append("svg")
.attr("width", sliderWidth + margin.left + margin.right)
.attr("height", sliderHeight + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
.domain([1850, 1995])
.range([0, sliderWidth])
.clamp(true);

var color = d3.scale.category20();

sliderContainer.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + sliderHeight / 2 + ")")
  .call(d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(8)
  .tickFormat(function(d) { return d; })
  .tickSize(0)
  .tickPadding(12))
  .select(".domain")
  .select(function() {
    return this.parentNode.appendChild(this.cloneNode(true));
  })
  .attr("class", "halo");

// Legend
var legend = d3.select("svg").append("g")
.attr("transform", "translate(" + (width - 140) + "," + 200 + ")")
.classed("legend", true);

var legendDate = legend.append("g")
.attr("transform", "translate(0,0)")
.append("text")
.classed("date-label", "true");

var projection = d3.geo.azimuthalEqualArea()
  .center([0, 37.28])
  .rotate([122.0, 0])
  .scale(3600 * 20)
  .translate([width / 2, height / 2]);

var path = d3.geo.path().projection(projection);

function ready(error, county, annexations, urban_areas, cities) {

  if (error) {
    loading.text("Sorry, there has been an error. " +
    "Please refresh and try again.");
    console.log(error);
  }

  data.county       = county;
  data.annexations  = annexations;
  data.urban_areas  = urban_areas;

  // Draw the initial map
  drawCounties();
  drawMap(current.year, current.map);
  loading.remove();
}

function drawMap(date, map) {

  var annexed = topojson.feature(data.annexations,
    data.annexations.objects["anex_" + current.year]);

    svg.selectAll(".annexations, .counties").remove();

    svg.selectAll(".annexation")
      .data(annexed.features)
      .enter().append("path")
      .classed("annexations", true)
      .attr("id", function(d) { return d.id; })
      .attr("d", path);

    svg.append("path")
      .datum(topojson.mesh(data.annexations, data.annexations.objects["anex_" + current.year],
      function(a, b) {
        return a.properties.s !== b.properties.s;
      }))
      .attr("class", "decade-" + current.year)
      .classed("county", true)
      .attr("d", path);

    svg.append("path")
      .datum(topojson.mesh(data.annexations, data.annexations.objects["anex_" + current.year],
      function(a, b) { return a === b; }))
      .attr("class", "decade-" + current.year)
      .classed("annexations", true)
      .attr("d", path);

    current.map = map;
    updateLegend(map);
}

function drawCounties() {
  var countylines = topojson.feature(data.county, data.county.objects.subunits);
  svg
  .selectAll(".subunit")
  .data(countylines.features)
  .enter().append("path")
  .attr("class", function(d) { return "subunit" + d.id; })
  .attr("d", path);

  svg.append("path")
  .datum(topojson.mesh(data.county, data.county.objects.subunits, function(a, b) { return a !== b; }))
  .attr("d", path)
  .attr("class", "subunit-boundary");

  svg.selectAll(".subunit-label")
  .data(topojson.feature(data.county, data.county.objects.subunits).features)
.enter().append("text")
  .attr("class", function(d) { return "subunit-label " + d.id; })
  .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
  .attr("dy", ".35em")
  .text(function(d) { return d.properties.name + " County"; });

  svg.selectAll(".urban_areas")
    .data(topojson.feature(data.urban_areas, data.urban_areas.objects.urban_areas).features)
  .enter().append("path")
    .style("fill", "#ccc")
    .style("stroke", "#B2B2B2")
    .attr("d", path)
    .style("opacity", "0.3");

svg.selectAll(".city-label")
    .data(topojson.feature(data.urban_areas, data.urban_areas.objects.urban_areas).features)
  .enter().append("text")
    .attr("class", function(d) { return "city-label " + d.id; })
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.properties.name; });
}

function renderDate(dated) {
  clickDate = dated;
  console.log(clickDate);

  if (clickDate !== current.year) {
    legendDate.text(clickDate);
    current.year = clickDate;
    drawMap(clickDate, current.map);
  }
}

function updateLegend(map) {
  legendDate.text(current.year);
}

function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

function showStatistics(data) {

// TODO: Begin work on a statistics view for the data.
// The statistics view should be a sidebar view to the left of the map.
// The visualization will show a small barchart of population that updates based
// on the year selected in the map view. Views of the data show the population;
// area size; population density;



}
