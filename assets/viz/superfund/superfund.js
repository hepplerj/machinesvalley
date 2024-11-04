import * as d3 from 'd3';
import L from 'leaflet';

export default class SuperfundMap {
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
      zoom: 11,
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

    // Initialize SVG overlay
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
      const [sites, ca_superfund, ca_toxics] = await Promise.all([
        d3.csv("/data/sv_companies.csv"),
        d3.csv("/data/ca_superfund.csv"),
        d3.csv("/data/ca_toxic_sites.csv")
      ]);
      
      this.ready(null, sites, ca_superfund, ca_toxics);
    } catch (error) {
      this.ready(error);
    }
  }

  ready(error, sites, ca_superfund, ca_toxics) {
    if (error) {
      this.loading.text("Sorry, there has been an error. Please refresh and try again.");
      console.log(error);
      return;
    }

    this.loading.remove();

    // Draw Superfund sites
    this.superfundElements = this.g
      .selectAll(".superfunds")
      .data(ca_superfund)
      .enter().append("circle")
      .attr("r", 12)
      .attr("class", "superfund-circ")
      .on("mouseover", (event, d) => {
        this.tooltip.transition().duration(200).style("opacity", .8);
        this.tooltip.html("<br><strong>SUPERFUND SITE</strong> <br>"
          + "<strong>Company</strong>: " + d.name +
          (d.listed ? "<br>" + "<strong>Date added</strong>: " + d.listed : "") + "<br>" +
          (d.deleted ? "<strong>Date deleted</strong>: " + d.deleted : "") + "<br>" +
          "<strong>Address</strong>: " + d.address + "<br>" +
          (d.cerclis_id ? "<br><strong>CERCLIS ID</strong>: " + d.cerclis_id : "") +
          (d.reason ? "<br><strong>Notes</strong>: " + d.reason : "")
        );
      })
      .on("mouseout", () => {
        this.tooltip.transition().duration(500).style("opacity", 0);
      });

    // Draw Toxic sites
    this.toxicsElements = this.g
      .selectAll(".toxics")
      .data(ca_toxics)
      .enter().append("circle")
      .attr("r", 6)
      .attr("class", "toxics-circ")
      .on("mouseover", (event, d) => {
        this.tooltip.transition().duration(200).style("opacity", .8);
        this.tooltip.html("<br>" + "<strong>" + "TOXIC LEAK/SPILL" + "</strong><br>" + d.company + "" +
          "<br>" + "Address: " + d.address + "<br>" +
          (d.company_type ? "<br>" + "Company type: " + d.company_type : "") + "<br>" +
          (d.source ? "<hr>" + "Source: " + d.source : ""))
      })
      .on("mouseout", () => {
        this.tooltip.transition().duration(500).style("opacity", 0);
      });

    // Draw Companies
    this.companyElements = this.g
      .selectAll(".companies")
      .data(sites)
      .enter().append("circle")
      .attr("r", 3)
      .attr("class", "company-circ")
      .on("mouseover", (event, d) => {
        this.tooltip.transition().duration(200).style("opacity", .8);
        this.tooltip.html("<br>" + "<strong>" + "COMPANY" + "</strong><br>"
          + d.company + "" +
          (d.date_founded ? "<br>" + "Founded: " + d.date_founded : "") + "<br>" +
          "Address: " + d.address + "<br>" +
          (d.company_type ? "<br>" + "Company type: " + d.company_type : "") + "<br>" +
          (d.description ? "<hr>" + d.description : ""))
      })
      .on("mouseout", () => {
        this.tooltip.transition().duration(500).style("opacity", 0);
      });

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

    this.superfundElements
      .attr("cx", d => this.mymap.latLngToLayerPoint([d.latitude, d.longitude]).x)
      .attr("cy", d => this.mymap.latLngToLayerPoint([d.latitude, d.longitude]).y);

    this.toxicsElements
      .attr("cx", d => this.mymap.latLngToLayerPoint([d.latitude, d.longitude]).x)
      .attr("cy", d => this.mymap.latLngToLayerPoint([d.latitude, d.longitude]).y);

    this.companyElements
      .attr("cx", d => this.mymap.latLngToLayerPoint([d.latitude, d.longitude]).x)
      .attr("cy", d => this.mymap.latLngToLayerPoint([d.latitude, d.longitude]).y);
  }
}