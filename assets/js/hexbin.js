// bbox is in SW, NE format
var bbox = [-122.2105, 37.1245, -121.589149, 37.54566];
var map = L.mapbox.map('map').setView([37.3382, -121.8863], 11);

var grid = turf.hex(bbox, 0.003);
var grid = turf.count(grid, pts, 'pt_count');

var layerGroup = L.layerGroup().addTo(map);

var hex = L.geoJson(grid, {
  style: function(feature){
    var fillColor,
      ptcount = feature.properties.pt_count;
    if (ptcount > 18) fillColor = "#bd0026", fillOpacity = 0.7;
    else if (ptcount > 12) fillColor = "#f03b20", fillOpacity = 0.7;
    else if (ptcount > 6) fillColor = "#fd8d3c", fillOpacity = 0.7;
    else if (ptcount > 1) fillColor = "#fecc5c", fillOpacity = 0.7;
    else if (ptcount > 0) fillColor = "#ffffb2", fillOpacity = 0.7;
    else fillColor = "#000000", fillOpacity = 0; // no data
    return { color: false, weight: 0.5, fillColor: fillColor, fillOpacity: fillOpacity };
  },
  onEachFeature: function( feature, layer ){
    layer.bindPopup( "<strong>" + feature.properties.pt_count + "</strong>")
  }
  }).addTo(layerGroup);

L.geoJson(pts, {
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 1.2,
      fillColor: '#f2f2f2',
      fillOpacity: 0.4,
      stroke: false
    });
  }
}).addTo(layerGroup);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  {
    attribution: 'Map tiles by <a href="https://cartodb.com/attributions">CartoDB</a>, under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="https://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>. Company data compiled by Jason A. Heppler',
    maxZoom: 17,
    minZoom: 9
  }).addTo(map);
