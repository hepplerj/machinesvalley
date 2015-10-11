queue()
.defer(d3.json, "/data-files/ca-counties/ca_counties.json")
.defer(d3.json, "/data-files/sv-annexations/sj_annexations.json")
.defer(d3.json, "/data-files/sv-urban/urban_areas_out.json")
.defer(d3.csv, "/data-files/sv-urban/ca-cities.csv")
.await(ready);

var margin = {top: 50, right: 50, bottom: 50, left: 50},
width = 1055,
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

// var brushToYear = d3.scale.threshold()
// .domain([1850, 1860, 1870, 1880, 1890,1900,1910,1912,1925,1930,1936,1940,1941,1946,1950,1955,1960,1965,1970,1975,1980,1985,1990,1995])
// .range([1850, 1860, 1870, 1880, 1890,1900,1910,1912,1925,1930,1936,1940,1941,1946,1950,1955,1960,1965,1970,1975,1980,1985,1990,1995]);

var color = d3.scale.category20();

// var brush = d3.svg.brush()
//   .x(x)
//   .extent([current.year, current.year])
//   .on("brush", brushed);

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

// var slider = sliderContainer.append("g")
//   .attr("class", "slider")
//   .call(brush);
//   slider.selectAll(".extent, .resize").remove();
//   slider.select(".background").attr("height", sliderHeight);

// var handle = slider.append("circle")
// .attr("class", "handle")
// .attr("transform", "translate(0," + sliderHeight / 2 + ")")
// .attr("r", 9);

// Legend
var legend = d3.select("svg").append("g")
.attr("transform", "translate(" + (width - 190) + "," + 200 + ")")
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

// function brushed() {
//   var value = brush.extent()[0];
//   // console.log(value);
//   if (d3.event.sourceEvent) {
//     value = x.invert(d3.mouse(this)[0]);
//     brush.extent([value, value]);
//   }
//   handle.attr("cx", x(value));
//   var brushDate = brushToYear(value-5);

//   if (brushDate !== current.year) {
//     legendDate.text(brushDate);
//     current.year = brushDate;
//     drawMap(brushDate, current.map);
//   }
// }

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

// function drawCities() {
//   bay_cities = svg.selectAll(".bay_cities")
//     .data(cities)
//   .enter().append("g")
//     .attr("class", "bay_cities")
//     .attr("transform", function(d) { return "translate(" + projection([d.longitude, d.latitude]) + ")"; });

//   bay_cities
//     .append("circle")
//     .attr("r", 8.5)
//     .attr("class", "bay_cities")
//     .style("fill","red");
// }

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