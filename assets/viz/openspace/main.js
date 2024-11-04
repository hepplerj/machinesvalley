import ConservationMap from './openspace';

document.addEventListener('DOMContentLoaded', () => {
    const conservationMap = new ConservationMap('viz');
    conservationMap.loadData().catch(console.error);
});
