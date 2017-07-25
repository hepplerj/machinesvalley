queue()
  .defer(d3.json, "/data-files/sv-annexations/sj_annexations.json")
  .defer(d3.csv, "/data-files/census-population/census-total.csv")
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

var maps = {
  "bayPopulation": {
    "field": "bayPopulation",
    "label": "Santa Clara County annexations"
  }
};

var current = { "year": 1850, "map": maps.bayPopulation };

var mymap = L.map('mapid', {
    center: [37.3382, -122.02],
    zoom: 11,
    dragging: true,
    scrollWheelZoom: 'center',
    doubleClickZoom: 'center',
    boxZoom: false,
    zoomControl: false
}); 

//add zoom control with your options
L.control.zoom({
     position:'topright'
}).addTo(mymap);

// OpenStreetMap Tile
L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
    attribution: '<a href="http://carto.com">CARTO</a>'
}).addTo(mymap);

// Historic basemaps
var sj_1938 = L.tileLayer("http://warp.worldmap.harvard.edu/maps/tile/4189/{z}/{x}/{y}.png");
var sj_1959 = L.tileLayer("http://warp.worldmap.harvard.edu/maps/tile/4184/{z}/{x}/{y}.png");
var sj_1886 = L.tileLayer("http://warp.worldmap.harvard.edu/maps/tile/4147/{z}/{x}/{y}.png");

var historic_layers = L.layerGroup([sj_1886, sj_1938, sj_1959]);
var overlayMaps = {
  "San Jose (1886)": sj_1886,
  "San Jose (1938)": sj_1938,
  "San Jose (1959)": sj_1959
}
L.control.layers(overlayMaps).addTo(mymap);

// .leaflet-objects-pane --> .leaflet-overlay-pane
var svg = d3.select(mymap.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");
    
var loading = svg.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("text-anchor", "middle")
    .text("Loading the map ...");

// d3.json("/data-files/sv-annexations/sj_annexations.json", function(error, tw) {
function ready(error, annexations, census) {
    if (error) {
        loading.text("Sorry, there has been an error. " +
        "Please refresh and try again.");
        console.log(error);
      }
      
      data.annexations  = annexations;
      data.census = census;
      
    //   var dataByCounty = d3.nest()
    //     .key(function(d) { return d.YEAR; })
    //     .entries(data.census);
    // console.log(dataByCounty);

      drawMap(current.year, current.map);
      loading.remove();
  }          
  
function drawMap(date, map) {
    d3.selectAll("path").remove();

    // GeoJSON SVG
    var transform = d3.geo.transform({
            point: projectPoint
        }),
        path = d3.geo.path().projection(transform);

    // Data Join Path
    var feature = g.selectAll("path")
        .data(topojson.feature(data.annexations, data.annexations.objects["anex_" + current.year]).features) 
        .enter().append("path");

    mymap.on("viewreset", reset);
    reset();
    
    // set the text in the overlay panel
    var text = [
      "Year: <b>" + current.year + "</b>"
    ];
    // update side panel
    manageSidePanel(text);
    
    // Reposition the SVG to cover the features
    function reset() {
        var bounds = path.bounds(topojson.feature(data.annexations, data.annexations.objects["anex_" + current.year])),
            topLeft = bounds[0],
            bottomRight = bounds[1];

        svg.attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

        feature.attr("d", path);
    }

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
        var point = mymap.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }
}
    
function renderDate(dated) {
  clickDate = dated;
  console.log(clickDate);

  if (clickDate !== current.year) {
    current.year = clickDate;
    drawMap(clickDate, current.map);
  }
}

function manageSidePanel(data) {
    var controls = d3.select("#controls");

    // remove current elements
    controls.selectAll("p").remove();

    // add new p elements
    controls.selectAll("p")
        .data(data)
      .enter().append("p")
        .html(function(d) { return d; })
  }

d3.select("#howToUse").on("click", function() {
  var state = d3.select("#instructions").style("display");
  if (state == "none") state = "block";
  else state = "none";
  d3.select("#instructions").style("display", state);
  d3.select(this).text(function() {
    return state == "none" ? "How to use..." : "How to use";
  })
})