import * as d3 from "d3";
import L from "leaflet";

export default class TrafficMap {
  constructor(id) {
    this.id = id;
    this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
    this.width = 900;
    this.height = Math.max(500, window.innerHeight - 200);
    this.initializeMap();
  }

  initializeMap() {
    // Initialize Leaflet map
    this.mymap = L.map(this.id, {
      center: [37.35, -122.0], // Centered on South Bay
      zoom: 11,
      dragging: true,
      doubleClickZoom: "center",
      boxZoom: false,
      zoomControl: false,
    });

    // Add zoom control
    L.control
      .zoom({
        position: "topright",
      })
      .addTo(this.mymap);

    // Add tile layer
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVwcGxlcmoiLCJhIjoiMjNqTEVBNCJ9.pGqKqkUDlcFmKMPeoARwkg",
      {
        attribution: '<a href="http://mapbox.com">Mapbox</a>',
      }
    ).addTo(this.mymap);

    // Disable scroll wheel zoom
    this.mymap.scrollWheelZoom.disable();

    // Initialize SVG overlay
    this.svg = d3.select(this.mymap.getPanes().overlayPane).append("svg");
    this.g = this.svg.append("g").attr("class", "leaflet-zoom-hide");

    // Add tooltip
    this.tooltip = d3
      .select(`#${this.id}`)
      .append("div")
      .attr("class", "map-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("pointer-events", "none")
      .style("z-index", 1000);

    // Add loading text
    this.loading = this.svg
      .append("text")
      .attr("x", 500)
      .attr("y", 250)
      .text("Loading map...")
      .style("font-size", "26px");

    // Create color scale for flow volumes
    this.color = d3.scaleSequential(d3.interpolateBlues).domain([1, 1000]); // Will update domain after loading data
  }

  async loadData() {
    try {
      const data = await d3.csv("/data/traffic.csv");
      this.ready(null, data);
    } catch (error) {
      this.ready(error);
    }
  }

  ready(error, data) {
    if (error) {
      this.loading.text(
        "Sorry, there has been an error. Please refresh and try again."
      );
      console.log(error);
      return;
    }

    this.loading.remove();

    // Process data
    this.data = data
      .map((d) => ({
        ...d,
        amount: +d.amount || 0,
        start_latitude: +d.start_latitude,
        start_longitude: +d.start_longitude,
        end_latitude: +d.end_latitude,
        end_longitude: +d.end_longitude,
      }))
      .filter((d) => d.amount > 0);

    // Update color scale domain based on actual data
    this.color.domain([1, d3.max(this.data, (d) => d.amount)]);

    // Draw flow lines
    this.data.forEach((flow) => {
      const line = L.polyline(
        [
          [flow.start_latitude, flow.start_longitude],
          [flow.end_latitude, flow.end_longitude],
        ],
        {
          color: "#333",
          weight: Math.max(1, Math.log(flow.amount) / Math.log(10)),
          opacity: 0.1,
          className: "flow-line",
        }
      ).addTo(this.mymap);

      // Add interactivity
      // In the ready method, update the tooltip mouseover event:
      line
        .on("mouseover", (e) => {
          line.setStyle({
            opacity: 0.8,
            color: "#ff7f0e",
          });

          // Get map container position
          const mapContainer = document.getElementById(this.id);
          const rect = mapContainer.getBoundingClientRect();

          this.tooltip
            .style("opacity", 1)
            .html(
              `
        <strong>${flow.home} to ${flow.work}</strong><br/>
        ${flow.amount.toLocaleString()} commuters
      `
            )
            .style("left", e.originalEvent.clientX - rect.left + 10 + "px")
            .style("top", e.originalEvent.clientY - rect.top - 28 + "px");
        })
        .on("mouseout", () => {
          line.setStyle({
            opacity: 0.1,
            color: "#333",
          });
          this.tooltip.style("opacity", 0);
        });
    });

    // Add city markers
    const cityCoordinates = {};
    this.data.forEach(d => {
        // When a city is the home city, use its start coordinates
        if (!cityCoordinates[d.home]) {
            cityCoordinates[d.home] = {
                lat: d.start_latitude,
                lng: d.start_longitude
            };
        }
        // When a city is the work city, use its end coordinates
        if (!cityCoordinates[d.work]) {
            cityCoordinates[d.work] = {
                lat: d.end_latitude,
                lng: d.end_longitude
            };
        }
    });

    // Add city markers
    const cities = new Set([...this.data.map(d => d.home), ...this.data.map(d => d.work)]);
    
    cities.forEach(city => {
        const coords = cityCoordinates[city];
        if (coords) {
            // Calculate total volume for this city
            const totalVolume = this.data
                .filter(d => d.home === city || d.work === city)
                .reduce((sum, d) => sum + d.amount, 0);

            L.circleMarker(
                [coords.lat, coords.lng],
                {
                    radius: Math.sqrt(totalVolume) / 10,
                    fillColor: '#1f77b4',
                    color: '#fff',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.7
                }
            )
            .bindPopup(`<strong>${city}</strong><br/>${totalVolume.toLocaleString()} total commuters`)
            .addTo(this.mymap);
        }
    });

    this.updatePositions();
    this.mymap.on("zoomend", () => this.updatePositions());
    this.mymap.on("moveend", () => this.updatePositions());
  }

  updatePositions() {
    const bounds = this.mymap.getBounds();
    const topLeft = this.mymap.latLngToLayerPoint(bounds.getNorthWest());
    const bottomRight = this.mymap.latLngToLayerPoint(bounds.getSouthEast());

    this.svg
      .attr("width", bottomRight.x - topLeft.x)
      .attr("height", bottomRight.y - topLeft.y)
      .style("left", `${topLeft.x}px`)
      .style("top", `${topLeft.y}px`);

    this.g.attr("transform", `translate(${-topLeft.x},${-topLeft.y})`);
  }
}
