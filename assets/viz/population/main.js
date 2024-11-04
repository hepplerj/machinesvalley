import PopulationChart from "./population";

document.addEventListener("DOMContentLoaded", () => {
    const populationChart = new PopulationChart("viz");
    populationChart.loadData().catch(console.error);
});