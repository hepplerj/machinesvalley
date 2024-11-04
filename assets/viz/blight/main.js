import BlightMap from './blight';

document.addEventListener('DOMContentLoaded', () => {
    const blightMap = new BlightMap('viz');
    blightMap.loadData().catch(console.error);
  });
