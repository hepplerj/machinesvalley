// annexations-map.js
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import Visualization from '../common/visualization';

export default class AnnexationsMap extends Visualization {
  constructor(id, data, dim) {
    const margin = {
      top: 10, right: 10, bottom: 10, left: 10,
    };
    super(id, data, dim, margin);
    this.width = 860;
    this.height = 500;
    this.currentYear = 1850;

    // Initialize the map
    this.initializeMap(id);
    
    // Initialize SVG layers
    this.initializeSvgLayers();

    // Process the initial data
    this.ready(null, data);
  }

  initializeMap(id) {
    this.mymap = L.map(id, {
      center: [37.31, -121.9],
      zoom: 11,
      dragging: true,
      doubleClickZoom: 'center',
      boxZoom: false,
      zoomControl: false
    });

    L.control.zoom({
      position: 'topright'
    }).addTo(this.mymap);

    L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVwcGxlcmoiLCJhIjoiMjNqTEVBNCJ9.pGqKqkUDlcFmKMPeoARwkg", {
      attribution: '<a href="http://mapbox.com">Mapbox</a>'
    }).addTo(this.mymap);

    this.mymap.scrollWheelZoom.disable();
  }

  initializeSvgLayers() {
    this.svg = d3.select(this.mymap.getPanes().overlayPane)
      .append("svg")
      .attr("class", "leaflet-zoom-hide");
    
    this.g = this.svg.append("g")
      .attr("class", "leaflet-zoom-hide");

    this.loading = this.svg.append("text")
      .attr("x", this.width / 2)
      .attr("y", this.height / 2)
      .attr("text-anchor", "middle")
      .text("Loading the map ...");
  }

  ready(error, data) {
    if (error) {
      this.loading.text("Sorry, there has been an error. Please refresh and try again.");
      console.error(error);
      return;
    }
    this.data = data;
    this.drawMap(this.currentYear);
    this.loading.remove();
  }

  drawMap(year) {
    // Clear existing paths
    this.g.selectAll("path").remove();

    // Create the custom projection using a closure to maintain context
    const projectPoint = (x, y) => {
      const point = this.mymap.latLngToLayerPoint(new L.LatLng(y, x));
      return [point.x, point.y];
    };

    // Create the custom transform
    const transform = {
      stream: function(s) {
        return {
          point: function(x, y) {
            const point = projectPoint(x, y);
            s.point(point[0], point[1]);
          },
          sphere: function() { s.sphere(); },
          lineStart: function() { s.lineStart(); },
          lineEnd: function() { s.lineEnd(); },
          polygonStart: function() { s.polygonStart(); },
          polygonEnd: function() { s.polygonEnd(); }
        };
      }
    };

    // Create the path generator with the custom projection
    const pathGenerator = d3.geoPath().projection(transform);

    try {
      // Filter data by year
      const features = topojson.feature(this.data, this.data.objects[`anex_${year}`]).features;

      // Create and update paths
      const paths = this.g.selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .attr("class", "annexation-area")
        .attr("d", pathGenerator);

      // Update view on map changes
      const resetView = () => {
        const bounds = pathGenerator.bounds(topojson.feature(this.data, this.data.objects[`anex_${year}`]));
        const topLeft = bounds[0];
        const bottomRight = bounds[1];

        this.svg
          .attr("width", bottomRight[0] - topLeft[0])
          .attr("height", bottomRight[1] - topLeft[1])
          .style("left", `${topLeft[0]}px`)
          .style("top", `${topLeft[1]}px`);

        this.g
          .attr("transform", `translate(${-topLeft[0]},${-topLeft[1]})`);

        paths.attr("d", pathGenerator);
      };

      // Bind the reset view function to map events
      this.mymap.on("viewreset", resetView);
      this.mymap.on("moveend", resetView);

      // Initial reset
      resetView();

    } catch (error) {
      console.error('Error drawing map:', error);
      this.g.append("text")
        .attr("class", "error-message")
        .attr("x", this.width / 2)
        .attr("y", this.height / 2)
        .text("Error drawing map data");
    }
  }

  renderDate(year) {
    if (year !== this.currentYear) {
      this.currentYear = year;
      this.drawMap(year);
    }
  }

  render() {
    this.drawMap(this.currentYear);
  }
}