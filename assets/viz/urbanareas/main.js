import UrbanAreasMap from './urbanareas';

document.addEventListener('DOMContentLoaded', () => {
    const urbanMap = new UrbanAreasMap('viz');
    urbanMap.loadData().catch(console.error);
  });
