import * as d3 from 'd3';
import L from 'leaflet';

export default class CensusMap {
  constructor(id) {
    this.id = id;
    this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
    this.width = 900;
    this.height = Math.max(500, window.innerHeight - 200);
    this.currentYear = '1960';
    this.populationField = {
      '1960': 'B7B002',
      '1970': 'C0X002'
    };
    this.initializeMap();
    this.createControls();
  }

  initializeMap() {
    // Initialize Leaflet map centered on San Jose area
    this.mymap = L.map(this.id, {
      center: [37.3382, -121.8863],
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

    // Create color scale for population values
    this.color = d3.scaleSequential(d3.interpolateOrRd)
      .domain([0, 100]); // Will update domain after loading data

    // Add tooltip
    this.tooltip = d3.select(`#${this.id}`).append("div")
      .attr("class", "map-tooltip")
      .style("opacity", 0);
  }

  createControls() {
    // Create year toggle control
    const control = L.control({ position: 'bottomleft' });
    
    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'year-control');
      div.innerHTML = `
        <div class="year-toggle" style="
          background: white;
          padding: 10px;
          border-radius: 4px;
          box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        ">
          <label style="display: block; margin-bottom: 5px;">Census Year:</label>
          <select id="year-select" style="width: 100px;">
            <option value="1960">1960</option>
            <option value="1970">1970</option>
          </select>
        </div>
      `;
      
      // Prevent map interactions when using the control
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);
      
      return div;
    };
    
    control.addTo(this.mymap);

    // Add event listener for year change
    d3.select('#year-select').on('change', (event) => {
      this.currentYear = event.target.value;
      this.updateMap();
    });
  }

  async loadData() {
    try {
      const [data1960, data1970] = await Promise.all([
        d3.json("/data/sanjose_1960.geojson"),
        d3.json("/data/sanjose_1970.geojson")
      ]);
      
      this.data = {
        '1960': data1960,
        '1970': data1970
      };
      
      this.ready();
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  ready() {
    // Update color scale domain based on both years' data using correct field names
    const allPopulations = [
      ...this.data['1960'].features.map(d => d.properties[this.populationField['1960']]),
      ...this.data['1970'].features.map(d => d.properties[this.populationField['1970']])
    ];
    
    this.color.domain([0, d3.max(allPopulations)]);
    this.createLegend();
    this.updateMap();
  }

  createLegend() {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '4px';
      div.style.border = '1px solid #ccc';

      const values = this.color.domain();
      const steps = 5;
      const step = (values[1] - values[0]) / steps;
      
      div.innerHTML = '<strong>African American Population</strong><br>';
      
      for (let i = 0; i < steps; i++) {
        const value = values[0] + (i * step);
        div.innerHTML += `
          <i style="background:${this.color(value)}; 
                    display:inline-block; 
                    width:20px; 
                    height:20px; 
                    margin-right:5px"></i>
          ${Math.round(value)}${i === steps - 1 ? '+' : '–' + Math.round(value + step)}<br>
        `;
      }

      return div;
    };

    legend.addTo(this.mymap);
  }

  updateMap() {
    if (this.currentLayer) {
      this.mymap.removeLayer(this.currentLayer);
    }

    // Get current population field name based on year
    const popField = this.populationField[this.currentYear];

    this.currentLayer = L.geoJSON(this.data[this.currentYear], {
      style: (feature) => ({
        fillColor: this.color(feature.properties[popField]),
        weight: 1,
        opacity: 1,
        color: '#666',
        fillOpacity: 0.7
      }),
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle({
              weight: 2,
              color: '#666',
              fillOpacity: 0.9
            });
            
            const mouseEvent = e.originalEvent;
            
            this.tooltip
              .style("opacity", 1)
              .html(`
                <strong>${feature.properties.AREANAME}</strong><br/>
                African American Population: ${feature.properties[popField]}
              `)
              .style("left", (mouseEvent.clientX + 10) + "px")
              .style("top", (mouseEvent.clientY - 28) + "px");
          },
          mouseout: (e) => {
            const layer = e.target;
            layer.setStyle({
              weight: 1,
              color: '#666',
              fillOpacity: 0.7
            });
            
            this.tooltip.style("opacity", 0);
          }
        });
      }
    }).addTo(this.mymap);

    this.mymap.fitBounds(this.currentLayer.getBounds());
  }
}