// Get our data ready
queue()
  .defer(d3.json, "/data-files/ca-counties/ca_counties.json")
  .defer(d3.json, "/data-files/sv-rivers/bay-rivers.json")
  .defer(d3.json, "/data-files/ca-openspace/openspace_santaclara.json")
  .defer(d3.csv, "/data-files/ca-pollution/ca_superfund.csv")
  .defer(d3.csv, "/data-files/ca-pollution/ca_toxic_sites.csv")
  .defer(d3.json, "/data-files/sv-urban/urban_areas_out.json")
  .defer(d3.json, "/data-files/sc-water/scc-water-features.topojson")
  .await(ready);

var width = 1055,
    height = 600,
    margin = {left: 50, right: 50, bottom: 50, top: 50};

var radius = d3.scale.sqrt()
    .domain([0, 6])
    .range([1, 5]);

var color = d3.scale.category20b();

var legendcolor = d3.scale.ordinal()
  .range(["#d21245", "orange", "#333333", "#e7cb94", "crimson","#0092B2"])
  .domain(["Superfund sites","Toxic sites and spills","Open space & parks","Urban areas","Water features","Rivers and creeks"]);

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

function ready(error, ca_counties, rivers, openspace, superfund, toxics, urban_areas, waterfeatures) {

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

  svg.selectAll(".waterfeatures")
    .data(topojson.feature(waterfeatures, waterfeatures.objects.waterfeatures).features)
  .enter().append("path")
    .style("fill", "crimson")
    .style("stroke", "crimson")
    .attr("class", "waterfeatures")
    .attr("id", function(d) { return d.TYPE; })
    .attr("d", path);

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

  // Legend
  var legendMargin = {left: 5, top: 10, right: 5, bottom: 10},
      legendWidth = 145,
      legendHeight = 270;

  var svgLegend = d3.select("svg").append("g")
        .attr("width", (legendWidth + legendMargin.left + legendMargin.right))
        .attr("height", (legendHeight + legendMargin.top + legendMargin.bottom));

  // var legendWrapper = svgLegend.append("g").attr("class", "legendWrapper")
  //         .attr("transform", "translate(" + legendMargin.left + "," + legendMargin.top +")");

  var rectSize = 15, //dimensions of the colored square
      rowHeight = 20, //height of a row in the legend
      maxWidth = 144; //widht of each row

  //Create container per rect/text pair
  var legend = svgLegend.selectAll('.legendSquare')
        .data(legendcolor.range())
      .enter().append('g')
        .attr('class', 'legendSquare')
        .attr("transform", function(d,i) { return "translate(" + 0 + "," + (i * rowHeight) + ")"; });

  //Non visible white rectangle behind square and text for better hover
  legend.append('rect')
      .attr('width', maxWidth)
      .attr('height', rowHeight)
      .style('fill', "white");

  //Append small squares to Legend
  legend.append('rect')
      .attr('width', rectSize)
      .attr('height', rectSize)
      .style('fill', function(d) {return d;});

  //Append text to Legend
  legend.append('text')
      .attr('transform', 'translate(' + 22 + ',' + (rectSize/2) + ')')
      .attr("class", "legendText")
      .style("font-size", "10px")
      .attr("dy", ".35em")
      .text(function(d,i) { return legendcolor.domain()[i]; });

  // svgLegend.append("text")
  //   .attr("transform","translate(" + 22 + "," + 122 + ")")
  //   .attr("class","legendExplain")
  //   .style("font-size","10px")
  //   .attr("dy",".35em")
  //   .text("Click legend items to toggle.")

  };

function filterPoints(pointData) {
  if(d3.selectAll(pointData).style("display") == "none") {
    d3.selectAll(pointData).style("display", "block")
  } else {
  d3.selectAll(pointData).style("display", "none")
  }
}
