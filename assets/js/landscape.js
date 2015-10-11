function drawCensus() {
  censusMap = d3.carto.map();
  d3.select("#map").call(censusMap);

  censusMap
    .centerOn([-121.9000, 37.3333], "latlong")
    .setScale(10);

  var color = d3.scale.quantize()
    .domain([0,58514])
    .range(colorbrewer.Purples[9]);

  baseLayer = d3.carto.layer.tile();
  baseLayer
    .path("terrain-background")
    .tileType("stamen")
    .label("Base");

  openspace = d3.carto.layer.topojson();
  openspace
    .path("/data-files/openspace_santaclara.json")
    .label("Open Space")
    .cssClass("openspace")
    .renderMode("canvas")
    .clickableFeatures(false)
    .markerColor("green");

    companies = d3.carto.layer.csv();
    superfunds = d3.carto.layer.csv();
    toxics = d3.carto.layer.csv();

    companiesModal = d3.carto.modal();
    companiesModal.formatter(function(d) {
      return "<p>" + d.company + " " + d.town + ", " + d.state + "</p>" +
      "<p>Date Founded: " + d.date_founded + "</p>" +
      "<p>Date Closed: " + d.date_closed + "</p>" +
      "<p>Company Type: " + d.company_type + "</p>" +
      "<p>Citation: " + d.source + "</p>"
    })

    companies
    .path("/data-files/sv-companies/sv_companies.csv")
    .label("Companies")
    .cssClass("company")
    .renderMode("svg")
    .x("longitude")
    .y("latitude")
    .markerSize(0)
    .modal(companiesModal)
    .clickableFeatures(true)
    .on("load", scaleCompanyCircles);

    superfunds
    .path("/data-files/ca-pollution/ca_superfund.csv")
    .label("Superfund")
    .cssClass("superfund")
    .renderMode("svg")
    .x("LONGITUDE")
    .y("LATITUDE")
    .markerSize(0)
    .clickableFeatures(false)
    .on("load", scaleSuperfundCircles);

    toxics
    .path("/data-files/ca-pollution/ca_toxic_sites.csv")
    .label("Toxics")
    .cssClass("toxics")
    .renderMode("svg")
    .x("longitude")
    .y("latitude")
    .markerSize(0)
    .clickableFeatures(false)
    .on("load", scaleToxics);

  censusMap
    .addCartoLayer(baseLayer)
    .addCartoLayer(openspace)
    .addCartoLayer(companies)
    .addCartoLayer(toxics)
    .addCartoLayer(superfunds);

}

function scaleCompanyCircles() {
  var memberScale = d3.scale.sqrt().domain([0,800]).range([1,8]).clamp(true);
  companies.g().selectAll("circle")
  .transition()
  .attr("r", 4)
  .duration(2500)
  .delay(function(d, i) { return i / 3500 * 3500; });
}

function scaleToxics() {
  var memberScale = d3.scale.sqrt().domain([0,800]).range([1,8]).clamp(true);
  companies.g().selectAll("circle")
  .transition()
  .attr("r", 4)
  .duration(2500)
  .delay(function(d, i) { return i / 3500 * 3500; });
}

function scaleSuperfundCircles() {
  var memberScale = d3.scale.sqrt().domain([0,800]).range([1,8]).clamp(true);
  superfunds.g().selectAll("circle")
  .transition()
  .attr("r", 10)
  .duration(2500)
  .delay(function(d, i) { return i / 2500 * 2500; });
}
