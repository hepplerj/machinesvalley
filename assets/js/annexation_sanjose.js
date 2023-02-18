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
  "sjAnnexations": {
    "field": "sjAnnexations",
    "label": "San Jose annexations"
  }
};

var current = { "year": 1850, "map": maps.sjAnnexations };

var mymap = L.map('mapid', {
    center: [37.3382, -122.02],
    zoom: 11,
    dragging: true,
    doubleClickZoom: 'center',
    boxZoom: false,
    zoomControl: false
}); 

//add zoom control with your options
L.control.zoom({
     position:'topright'
}).addTo(mymap);

// Mapbox Tile
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVwcGxlcmoiLCJhIjoiMjNqTEVBNCJ9.pGqKqkUDlcFmKMPeoARwkg", { attribution: '<a href="https://mapbox.com">Mapbox</a>' }).addTo(mymap);

mymap.scrollWheelZoom.disable();

// Historic basemaps
var sj_1938 = L.tileLayer("https://warp.worldmap.harvard.edu/maps/tile/4189/{z}/{x}/{y}.png");
var sj_1959 = L.tileLayer("https://warp.worldmap.harvard.edu/maps/tile/4184/{z}/{x}/{y}.png");
var sj_1886 = L.tileLayer("https://warp.worldmap.harvard.edu/maps/tile/4147/{z}/{x}/{y}.png");
var sj_ward1 = L.tileLayer("https://maps.georeferencer.com/georeferences/964369491444/2017-02-20T14:25:19.132722Z/map/{z}/{x}/{y}.png?key=KPlLnmp6U0gZTmAcJ4Ob");
var sj_ward2 = L.tileLayer("https://maps.georeferencer.com/georeferences/378644494803/2017-02-20T14:25:19.132722Z/map/{z}/{x}/{y}.png?key=KPlLnmp6U0gZTmAcJ4Ob");
var sj_ward3 = L.tileLayer("https://maps.georeferencer.com/georeferences/786097815676/2015-03-09T17:36:28.256160Z/map/{z}/{x}/{y}.png?key=KPlLnmp6U0gZTmAcJ4Ob");
var sj_ward4 = L.tileLayer("https://maps.georeferencer.com/georeferences/821679024348/2015-05-15T15:47:08.411680Z/map/{z}/{x}/{y}.png?key=KPlLnmp6U0gZTmAcJ4Ob");

var scc_1876 = L.tileLayer("https://maps.georeferencer.com/georeferences/65947386281/2014-11-07T21:32:19.066300Z/map/{z}/{x}/{y}.png?key=KPlLnmp6U0gZTmAcJ4Ob");

var historic_layers = L.layerGroup([sj_1886, sj_1938, sj_1959]);
var overlayMaps = {
  "San Jose, Ward 1 (1876)": sj_ward1,
  "San Jose, Ward 2 (1876)": sj_ward2,
  "San Jose, Ward 3 (1876)": sj_ward3,
  "San Jose, Ward 4 (1876)": sj_ward4,

  "San Jose (1886)": sj_1886,
  "San Jose (1938)": sj_1938,

  "Western Santa Clara County (1876)": scc_1876,

  "Bay Area (1959)": sj_1959
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

function ready(error, annexations, census) {
    if (error) {
        loading.text("Sorry, there has been an error. " +
        "Please refresh and try again.");
        console.log(error);
      }
      
      data.annexations  = annexations;
      data.census = census;

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
      "Year: <b>" + current.year + "</b>",
      "Percentage of African Americans: <b>" + "%" + "</b>"
    ];
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
//   console.log(clickDate);

  if (clickDate !== current.year) {
    current.year = clickDate;
    // d3.selectAll(".row-" + clickDate + " > td").style('background-color', '#e5f5e0')
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
