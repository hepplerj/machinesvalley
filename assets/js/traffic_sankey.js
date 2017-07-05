// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

// format variables
var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return "$" + formatNumber(d); },
    color = d3.scaleOrdinal(d3.schemeCategory20);

// append the svg object to the body of the page
var svg = d3.select("#viz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(10)
    .nodePadding(10)
    .size([width, height]);

var path = sankey.link();

// load the data
d3.queue()
    .defer(d3.csv, "/data-files/sv-traffic/traffic.csv")
    .await(ready);

function ready(error, csv){

  // create an array to push all sources and targets, before making them unique
  var arr = [];
  csv.forEach(function(d){
    arr.push(d.home);
    arr.push(d.work);
  });

  // create nodes array
  var nodes = arr.filter(onlyUnique).map(function(d,i){
    return {
      node: i,
      name: d
    }
  });

  // create links array
  var links = csv.map(function(csv_row){
    return {
      source: getNode("home"),
      target: getNode("work"),
      value: +csv_row.value
    }

    function getNode(type){
      return nodes.filter(function(node_object){ return node_object.name == csv_row[type]; })[0].node;
    }

  });

  sankey
      .nodes(nodes)
      .links(links)
      .layout(32);

  // add in the links
  var link = svg.append("g").selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke", function(d){
        return color(d.source.name.replace(/ .*/, ""));
      })
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });

  // add the link titles
  link.append("title")
        .text(function(d) {
        return d.source.name + " → " + 
                d.target.name + "\n" + format(d.value); });

  // add in the nodes
  var node = svg.append("g").selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")"; 
      })
      .call(d3.drag()
        .subject(function(d) {
          return d;
        })
        .on("start", function() {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove));

  // add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return d.dy < 0 ? .1 : d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { 
        return d.color = color(d.name.replace(/ .*/, "")); 
      })
      .style("stroke", function(d) { 
        return d3.rgb(d.color).darker(2); 
      })
    .append("title")
      .text(function(d) { 
        return d.name + "\n" + format(d.value); 
      });

  // add in the title for the nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

  // the function for moving the nodes
  function dragmove(d) {
    d3.select(this)
      .attr("transform", 
            "translate(" 
               + d.x + "," 
               + (d.y = Math.max(
                  0, Math.min(height - d.dy, d3.event.y))
                 ) + ")");
    sankey.relayout();
    link.attr("d", path);
  }

}

// unique values of an array
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}