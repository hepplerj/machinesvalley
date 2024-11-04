import TrafficMap from './traffic.js';

document.addEventListener('DOMContentLoaded', () => {
  const map = new TrafficMap('map');
  map.loadData();
});