import * as d3 from "d3";
import L from "leaflet";

export default class BlightMap {
  constructor(id) {
    this.id = id;
    this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
    this.width = 900;
    this.height = Math.max(500, window.innerHeight - 200);
    this.initializeMap();
    this.mayfairLayers = new Set();
    this.barrioColor = d3.scaleOrdinal(d3.schemeDark2);

    this.layerLabels = {
      agri: "Agricultural",
      agricu: "Agriculture",
      commercial: "Commercial",
      industrial: "Industrial",
      mayfair: "Mayfair",
      otherres: "Other Residential",
      park: "Park",
      public: "Public",
      singfam: "Single Family",
    };
  }

  initializeMap() {
    // Initialize Leaflet map
    this.mymap = L.map(this.id, {
      center: [37.344, -121.87],
      zoom: 14,
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
      },
    ).addTo(this.mymap);

    // Disable scroll wheel zoom
    this.mymap.scrollWheelZoom.disable();

    // Initialize SVG overlay
    this.svg = d3.select(this.mymap.getPanes().overlayPane).append("svg");
    this.g = this.svg.append("g").attr("class", "leaflet-zoom-hide");

    this.tooltip = d3
      .select(`#${this.id}`)
      .append("div")
      .attr("class", "map-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("top", "10px")
      .style("left", "10px");

    this.loading = this.svg
      .append("text")
      .attr("x", 500)
      .attr("y", 250)
      .text("Loading map...")
      .style("font-size", "26px");

    this.color = d3.scaleOrdinal(d3.schemeSet2);

    d3.select(`#${this.id}`)
      .append("div")
      .attr("class", "attribution")
      .append("label")
      .html(
        '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      );
  }

  async loadData() {
    try {
      const [blight, mayfair, barrios] = await Promise.all([
        d3.json("/data/sj_blight.geojson"),
        d3.json("/data/mayfair.geojson"),
        d3.csv("/data/barrios.csv"),
      ]);
      this.ready(null, blight, mayfair, barrios);
    } catch (error) {
      this.ready(error);
    }
  }

  ready(error, blight, mayfair, barrios) {
    if (error) {
      this.loading.text(
        "Sorry, there has been an error. Please refresh and try again.",
      );
      console.log(error);
      return;
    }

    this.loading.remove();

    // Store unique layer values
    mayfair.features.forEach((feature) => {
      this.mayfairLayers.add(feature.properties.layer);
    });

    // More dynamic and visible styling
    L.geoJSON(blight, {
      style: (feature) => {
        return {
          color: "#000",
          weight: 1,
          opacity: 0.7,
          fillColor: "#0000ff",
          fillOpacity: 0.2,
        };
      },
    }).addTo(this.mymap);

    // Add mayfair layer
    L.geoJSON(mayfair, {
      style: (feature) => ({
        color: "#000",
        weight: 1,
        opacity: 0.7,
        fillColor: this.color(feature.properties.layer),
        fillOpacity: 0.7,
      }),
    }).addTo(this.mymap);

    // Add barrios points
    barrios.forEach((point) => {
      L.circleMarker([point.latitude, point.longitude], {
        radius: 4,
        fillColor: "#000",
        weight: 0,
        opacity: 1,
        fillOpacity: 1,
      })
        .bindPopup(point.barrio)
        .addTo(this.mymap);
    });

    // Add legend
    this.addLegend();

    this.updatePositions();
    this.mymap.on("zoomend", () => this.updatePositions());
    this.mymap.on("moveend", () => this.updatePositions());
  }

  addLegend() {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      div.style.backgroundColor = "white";
      div.style.padding = "10px";
      div.style.border = "2px solid rgba(0,0,0,0.2)";
      div.style.borderRadius = "4px";

      // Add title
      div.innerHTML =
        '<h4 style="margin:0 0 10px 0; text-align: center;">Mayfair</h4>';

      // Add legend items
      Array.from(this.mayfairLayers)
        .sort((a, b) =>
          (this.layerLabels[a] || a).localeCompare(this.layerLabels[b] || b),
        )
        .forEach((layer) => {
          div.innerHTML += `
            <div style="margin-bottom:5px">
              <i style="background:${this.color(layer)}; 
                        display:inline-block; 
                        width:20px; 
                        height:20px; 
                        margin-right:5px;
                        opacity:0.8"></i>
              ${this.layerLabels[layer] || layer}
            </div>`;
        });

      return div;
    };

    legend.addTo(this.mymap);
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

