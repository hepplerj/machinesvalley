import * as d3 from 'd3';

export default class PopulationChart {
  constructor(id) {
    this.id = id;
    this.margin = { top: 50, right: 120, bottom: 50, left: 40 };
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 600 - this.margin.top - this.margin.bottom;
    this.initializeChart();
  }

  initializeChart() {
    this.x = d3.scaleBand()
      .rangeRound([0, this.width])
      .padding(0.1);

    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0]);

    this.color = d3.scaleOrdinal()
      .range(["#EFB605", "#E58903", "#E01A25", "#C20049", "#991C71", "#66489F", "#2074A0", "#10A66E", "#7EB852"]);

    this.svg = d3.select(`#${this.id}`).append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
  }

  async loadData() {
    try {
      const data = await d3.csv("/data/population_bay_area.csv");
      this.color.domain(Object.keys(data[0]).filter(key => key !== "date"));

      data.forEach(d => {
        let y0 = 0;
        d.populations = this.color.domain().map(name => ({ name, y0, y1: y0 += +d[name] }));
        d.populations.forEach(d => { d.y0 /= y0; d.y1 /= y0; });
      });

      data.sort((a, b) => a.date - b.date);

      this.x.domain(data.map(d => d.date));

      this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${this.height})`)
        .call(d3.axisBottom(this.x));

      this.svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(this.y).tickFormat(d3.format(".0%")));

      const state = this.svg.selectAll(".state")
        .data(data)
        .enter().append("g")
        .attr("class", "state")
        .attr("transform", d => `translate(${this.x(d.date)},0)`);

      state.selectAll("rect")
        .data(d => d.populations)
        .enter().append("rect")
        .attr("width", this.x.bandwidth() - 2)
        .attr("y", d => this.y(d.y1))
        .attr("height", d => this.y(d.y0) - this.y(d.y1))
        .style("fill", d => this.color(d.name));

      const legend = this.svg.select(".state:last-child").selectAll(".legend")
        .data(d => d.populations)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", d => `translate(${this.x.bandwidth()},${this.y((d.y0 + d.y1) / 2)})`);

      legend.append("line")
        .attr("x2", 10);

      legend.append("text")
        .attr("x", 13)
        .attr("dy", ".35em")
        .text(d => d.name);
    } catch (error) {
      console.error('Error loading the CSV data:', error);
    }
  }
}