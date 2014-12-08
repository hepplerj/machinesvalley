---
title: Green Space in the Bay Area
date: 2014-04-13
permalink: /visualizations/greenspace/
layout: page
---

<style type="text/css">

html, body { height: 100% }

#map { min-height: 100%; }

.leaflet-popup-content-wrapper {
    -webkit-border-radius: 5px;
    border-radius: 5px;
}

path { stroke-linejoin; round; stroke-linecap: round; fill: none}
path.river { stroke : #24b; }
path.road { stroke: #b42; }
path.water { stroke: #bcf; fill: #abf; }
path.landuse { stroke: #bb2; fill: #cc2; opacity: 0.4 }
path.building { stroke: #f00; fill: #f00; }

img { -webkit-filter: grayscale(100%) brightness(40%) contrast(150%);}

</style>

<div id="map"></div>

<script type="text/javascript">

// Construct map, center if no location provided
var map = L.map('map', { minZoom: 7, maxZoom: 15 } );

var hash = new L.Hash(map);
if (!window.location.hash) {
    map.setView([37.34, -122.04], 10);
}

// Make the base map; a raster tile relief map from ESRI
var esriRelief = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}'
var basemap = L.tileLayer(esriRelief, {
        attribution: '<a href="http://www.arcgis.com/home/item.html?id=9c5370d0b54f4de1b48a3792d7377ff2">ESRI shaded relief</a>, <a href="http://www.horizon-systems.com/NHDPlus/NHDPlusV2_home.php">NHDPlus v2</a>, OpenStreetMap',
        maxZoom: 13
});
basemap.addTo(map);

// Add a fake GeoJSON line to coerce Leaflet into creating the <svg> tag that d3_geoJson needs
new L.geoJson({"type": "LineString","coordinates":[[0,0],[0,0]]}).addTo(map);

// Land use areas from OpenStreetMap
var landColors = {
  "farm": 1,
  "meadow": 1,
  "scrub": 1,
  "forest": 1,
  "farmyard": 1,
  "farmland": 1,
  "wood": 1,
  "park": 1,
  // "cemetery": 1,
  // "golf_course": 1,
  "grass": 1,
  "nature_reserve": 1,
  "pitch": 1,
  "common": 1,
  // "residential": "#ddd",
  // "industrial": "#b3c",
  // "commercial": "#b3c",
  // "retail": "#b3c",
  // "parking": "#b3c",
  // "quarry": "#b3c",
  // "school": "#b3c",
  // "hospital": "#b3c",
  // "college": "#b3c",
  // "university": "#b3c",
}
function rando(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
new L.TileLayer.d3_topoJSON("http://tile.openstreetmap.us/vectiles-land-usages/{z}/{x}/{y}.topojson", {
  class: "landuse",
  layerName: "vectile",
  style: function(d) {
    var c = landColors[d.properties.kind];
    if (!c) { c = "#fff"; }
    if (c == 1) {    // random greens
      c = "hsl(" + rando(100, 130) + ", " + rando(50,70) + "%, " + rando(30, 50) + "%)";
    }
    return "fill: " + c;
  }
}).addTo(map);

// Water Areas from OpenStreetMap
new L.TileLayer.d3_topoJSON("http://tile.openstreetmap.us/vectiles-water-areas/{z}/{x}/{y}.topojson", {
  class: "water",
  layerName: "vectile",
  style: ""
}).addTo(map);

// Highways from OpenStreetMap
// var roadSizes = {
//   "highway": "5px",
//   "major_road": "3px",
//   "minor_road": "1px",
//   "rail": "0px",
//   "path": "0.5px"
// };

// new L.TileLayer.d3_topoJSON("http://tile.openstreetmap.us/vectiles-highroad/{z}/{x}/{y}.topojson", {
//   class: "road",
//   layerName: "vectile",
//   style: function(d) { return "stroke-width: " + roadSizes[d.properties.kind]; }
// }).addTo(map);

</script>
