import * as d3 from 'd3';
import L from 'leaflet';
import * as topojson from 'topojson-client';

export default class UrbanAreasMap {
  constructor(id) {
    this.id = id;
    this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
    this.width = 900;
    this.height = Math.max(500, window.innerHeight - 200);
    this.lastYear = 2000;
    this.company = {};
    this.legend_width = 120;
    this.initializeMap();
  }

  initializeMap() {
    // Initialize Leaflet map
    this.mymap = L.map(this.id, {
      center: [37.31, -121.9],
      zoom: 10,
      dragging: true,
      doubleClickZoom: 'center',
      boxZoom: false,
      zoomControl: false
    });

    // Add zoom control
    L.control.zoom({
      position: 'topright'
    }).addTo(this.mymap);

    // Add tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVwcGxlcmoiLCJhIjoiMjNqTEVBNCJ9.pGqKqkUDlcFmKMPeoARwkg", {
      attribution: '<a href="http://mapbox.com">Mapbox</a>'
    }).addTo(this.mymap);

    // Disable scroll wheel zoom
    this.mymap.scrollWheelZoom.disable();

    // Initialize SVG overlay for points
    this.svg = d3.select(this.mymap.getPanes().overlayPane).append("svg");
    this.g = this.svg.append("g").attr("class", "leaflet-zoom-hide");

    this.tooltip = d3.select(`#${this.id}`).append("div")
      .attr("class", "map-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("top", "10px")
      .style("left", "10px");

    this.loading = this.svg.append("text")
      .attr("x", 500)
      .attr("y", 250)
      .text("Loading map...")
      .style("font-size", "26px");

    this.color = d3.scaleOrdinal(d3.schemeSet3);

    d3.select(`#${this.id}`)
      .append("div")
      .attr("class", "attribution")
      .append("label")
      .html('<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>');
  }

  async loadData() {
    try {
      const [urbanareas] = await Promise.all([
        d3.json("/data/urban_areas_out.json"),
      ]);

      this.ready(null, urbanareas);
    } catch (error) {
      this.ready(error);
    }
  }

  ready(error, urbanareas) {
    if (error) {
      this.loading.text("Sorry, there has been an error. Please refresh and try again.");
      console.log(error);
      return;
    }

    this.loading.remove();

    // Draw urban areas using Leaflet's geoJSON method
    L.geoJSON(topojson.feature(urbanareas, urbanareas.objects.urban_areas), {
      style: (feature) => {
        return {
          color: "#000", // Set border stroke color
          weight: 1,
          opacity: 1,
          fillColor: this.color(feature.properties.name), // Use a different color for each urban area
          fillOpacity: 0.5, // Adjust fill opacity as needed
        };
      }
    }).addTo(this.mymap);

    this.updatePositions();
    this.mymap.on("zoomend", () => this.updatePositions());
    this.mymap.on("moveend", () => this.updatePositions());
  }

  updatePositions() {
    const bounds = this.mymap.getBounds();
    const topLeft = this.mymap.latLngToLayerPoint(bounds.getNorthWest());
    const bottomRight = this.mymap.latLngToLayerPoint(bounds.getSouthEast());

    this.svg.attr("width", bottomRight.x - topLeft.x)
      .attr("height", bottomRight.y - topLeft.y)
      .style("left", `${topLeft.x}px`)
      .style("top", `${topLeft.y}px`);

    this.g.attr("transform", `translate(${-topLeft.x},${-topLeft.y})`);
  }
}