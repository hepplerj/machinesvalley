// main.js
import * as d3 from 'd3';
import AnnexationsMap from './annexations-map';

class MapController {
    constructor() {
        this.map = null;
        this.initialize();
    }

    initialize() {
        // Load data and initialize map
        fetch('/data/mountainview.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(annexationsData => {
                this.map = new AnnexationsMap(
                    'map',
                    annexationsData,
                    { width: 1000, height: 525 }
                );
                this.map.render();
                this.setupEventListeners();
            })
            .catch(error => {
                console.error('Error:', error);
                const mapElement = document.getElementById('map');
                if (mapElement) {
                    mapElement.innerHTML = `<div class="error-message">Failed to load map data. Please try refreshing the page.</div>`;
                }
            });
    }

    setupEventListeners() {
        // Add click listeners to all year buttons
        const yearButtons = document.querySelectorAll('[data-year]');
        yearButtons.forEach(button => {
            button.addEventListener('click', this.handleYearButtonClick.bind(this));
        });
    }

    handleYearButtonClick = (event) => {
        const year = event.target.dataset.year;
        console.log('Clicked year:', year);
        if (this.map) {
            this.map.renderDate(parseInt(year));
        }
    }
}

// Initialize the controller when the page loads
const controller = new MapController();