import CensusMap from './census.js';

document.addEventListener('DOMContentLoaded', () => {
  const map = new CensusMap('map');
  map.loadData();
});