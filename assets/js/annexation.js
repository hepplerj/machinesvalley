queue()
  .defer(d3.json, "/data/ca-counties/ca_counties.json")
  .defer(d3.json, "/data/sv-annexations/sj_annexations.json")
  .await(ready);

var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000,
    height = Math.max(500, window.innerHeight - 200),
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
    "label": "San Jose population",
    "scale": d3.scale.threshold()
            .domain([1,10,33,100,333,1e3,3.33e3,10e3,33.3e3,100e3])
  },
  "bayDensity": {
    "field": "bayDensity",
    "label": "Population, persons/mile²",
    "scale": d3.scale.threshold()
            .domain([0.01,0.5,1,5,10,20,30,40,50,200])
  },
  "bayPercentage": {
    "field": "bayPercentage",
    "label": "Population (%)",
    "scale": d3.scale.threshold()
            .domain([0.01,1,10,20,30,40,50,60,70,100])
  }
};

var current = { "year": 1850, "map": maps.bayPopulation };

var svg = d3.select("#map").append("svg")
  .attr("width", width)
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
  .domain([1850, 2000])
  .range([0, sliderWidth])
  .clamp(true);

var brushToYear = d3.scale.threshold()
  .domain([1850,1855,1860,1865,1870,1875,1880,1885,1890,1895,1900,1910,1912,1925,1930,1936,1940,1941,1946,1950,1955,1960,1965,1970,1975,1980,1985,1990,1995,2000])
  .range([1850,1855,1860,1865,1870,1875,1880,1885,1890,1895,1900,1910,1912,1925,1930,1936,1940,1941,1946,1950,1955,1960,1965,1970,1975,1980,1985,1990,1995,2000]);

var brush = d3.svg.brush()
  .x(x)
  .extent([current.year, current.year])
  .on("brush", brushed);

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

var slider = sliderContainer.append("g")
  .attr("class", "slider")
  .call(brush);
slider.selectAll(".extent, .resize").remove();
slider.select(".background").attr("height", sliderHeight);

var handle = slider.append("circle")
.attr("class", "handle")
.attr("transform", "translate(0," + sliderHeight / 2 + ")")
.attr("r", 9);

// Field selector
var fieldSelector = d3.select("#field-selector")
.on("change", fieldSelected);

for (var key in maps) {
  fieldSelector.append("option")
  .attr("value", key)
  .text(maps[key].label);
}

// Legend
var legend = svg.append("g")
.attr("transform", "translate(" + (width - 190) + "," + 200 + ")")
.classed("legend", true);

var legendDate = legend.append("g")
.attr("transform", "translate(0,0)")
.append("text")
.classed("date-label", "true");

var legendField = legend.append("g")
.attr("transform", "translate(0,20)")
.append("text");

var projection = d3.geo.azimuthalEqualArea()
  .center([0, 37.27])
  .rotate([121.9, 0])
  .scale(3200 * 20)
  .translate([width / 2, height / 2]);

var path = d3.geo.path().projection(projection);

function ready(error, county, annexations) {

  if (error) {
    loading.text("Sorry, there has been an error. " +
    "Please refresh and try again.");
    console.log(error);
  }

  data.county       = county;
  data.annexations  = annexations;

  // Draw the initial map
  slider.call(brush.event).call(brush.extent([1850, 1850])).call(brush.event);
  drawCounties();
  drawMap(current.year, current.map);
  loading.remove();
}

function brushed() {
  var value = brush.extent()[0];
  if (d3.event.sourceEvent) {
    value = x.invert(d3.mouse(this)[0]);
    brush.extent([value, value]);
  }
  handle.attr("cx", x(value));
  var brushDate = brushToYear(value-5);

  if (brushDate !== current.year) {
    legendDate.text(brushDate);
    current.year = brushDate;
    drawMap(brushDate, current.map);
  }
}

function drawMap(date, map) {

  var annexed = topojson.feature( data.annexations,
                                  data.annexations.objects["anex_" + current.year] );

    svg.selectAll(".annexation, .county").remove();

    svg.selectAll(".annexation")
      .data(annexed.features)
    .enter().append("path")
      .attr("class", "annexation")
      .classed("na", "none")
      .classed("counties", true)
      .attr("id", function(d) { return d.id; })
      .attr("d", path);

    svg.append("path")
      .datum(topojson.mesh(data.annexations, data.annexations.objects["anex_" + current.year],
      function(a, b) {
        return a.properties.s !== b.properties.s;
      }))
      .attr("class", "decade-" + current.year)
      .classed("states", true) .attr("d", path);

    svg.append("path")
      .datum(topojson.mesh(data.annexations, data.annexations.objects["anex_" + current.year],
      function(a, b) { return a === b; }))
      .attr("class", "decade-" + current.year)
      .classed("county", true)
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
}

function fieldSelected() {
  field = fieldSelector.node().value;
  drawMap(current.year, maps[field]);
}

function updateLegend(map) {
  legendDate.text(current.year);
  //legendField.text(map.label);
}

function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}
