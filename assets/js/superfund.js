queue()
    .defer(d3.csv, "/data/sv_companies.csv")
    .defer(d3.csv, "/data/ca_superfund.csv")
    .defer(d3.csv, "/data/ca_toxic_sites.csv")
    .await(ready);

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1140,
    height = Math.max(500, window.innerHeight - 200),
    lastYear = 2000,
    company = {};
    legend_width = 120;

// Map variables

var tile = d3.geo.tile()
    .size([width, height]);

var projection = d3.geo.mercator()
    .scale((1 << 19) / 2 / Math.PI)
    .translate([width / 2, height / 2]);

var center = projection([-122.0375, 37.3711]);

var path = d3.geo.path()
    .projection(projection);

geoPath = d3.geo.path().projection(projection);

var zoom = d3.behavior.zoom()
    .scale(projection.scale() * 2 * Math.PI)
    .scaleExtent([1 << 19, 1 << 26])
    .translate([width - center[0], height - center[1]])
    .on("zoom", zoomed);

// Adjust the projection on the computed center
// so it uses the zoom behavior's translate & scale
projection
    .scale(1 / 2 / Math.PI)
    .translate([0, 0]);

var tooltip = d3.select("#viz").append("div")
    .attr("class", "map-tooltip")
    .style("opacity", 0);

var svg = d3.select("#viz").append("svg")
    .attr("width", width)
    .attr("height", height);

var loading = svg.append("text").attr({x:500,y:250}).text("Loading map...").style("font-size", "26px");

var raster = svg.append("g");
var vector = svg.append("path");

var color = d3.scale.category20b();

function ready(error, sites, ca_superfund, ca_toxics) {
  if (error) {
      loading.text("Sorry, there has been an error. " +
                   "Please refresh and try again.");
      console.log(error);
    }

  loading.remove();
  svg.call(zoom);

  // Field selector for company types
  companyTypes = d3.nest()
    .key(function(d) { return d.company_type;})
    .sortKeys(d3.ascending)
    .entries(sites);

  var listCompanyTypes = d3.select("#field-selector").append("select").attr("class", "form-control").on("change", fieldSelected);

  listCompanyTypes.selectAll("option")
    .data(companyTypes)
  .enter()
    .append("option")
    .attr("value", function(d) { return d.key})
    .text(function(d) { return d.key.toTitleCase(); });

    // Draw Superfund sites
    var superfundsG = svg.append("g")
        .attr("id", "superfundG")
        .attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");

    var superfund_sites = superfundsG.selectAll(".superfunds")
      .data(ca_superfund)
    .enter()
      .append("g")
      .attr("transform", function (d) {
          return "translate(" + projection([d.longitude, d.latitude]) + ")scale(" + projection.scale() + ")"
      })
      .on("mouseover", function(d,i) {
        tooltip.transition().duration(200).style("opacity", .8);
        tooltip.html("<br><strong>SUPERFUND SITE</strong> <br>" 
                + "<strong>Company</strong>: " + d.name.toTitleCase() +
                (d.listed?"<br>" + "<strong>Date added</strong>: "+d.listed:"") + "<br>" +
                (d.deleted?"<strong>Date deleted</strong>: "+d.deleted:"") + "<br>" +
                "<strong>Address</strong>: " + d.address.toTitleCase() + "<br>" +
                (d.cerclis_id?"<br><strong>CERCLIS ID</strong>: "+d.cerclis_id:"") +
                (d.reason?"<br><strong>Notes</strong>: "+d.reason:"")
                )
      })
      .on("mouseout", function(d,i) {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    superfund_sites
      .append("circle")
      .attr("r", 60)
      .attr("class", "superfund-circ");

    var companiesG = svg.append("g")
        .attr("id", "companiesG")
        .attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");

    var companyPoints = companiesG.selectAll(".companies")
        .data(sites)
      .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")scale(" + projection.scale() + ")"
        })
        .on("mouseover", function(d,i) {
          tooltip.transition().duration(200).style("opacity", .8);
          tooltip.html("<br>" + "<strong>" + "COMPANY" + "</strong><br>" 
                  + d.company.toTitleCase() + "" +
                  (d.date_founded?"<br>" + "Founded: "+d.date_founded:"") + "<br>" +
                  "Address: " + d.address.toTitleCase() + "<br>" +
                  (d.company_type?"<br>" + "Company type: " + d.company_type:"") + "<br>" +
                  (d.description?"<hr>"+d.description:""))
        })
        .on("mouseout", function(d,i) {
          tooltip.transition().duration(500).style("opacity", 0);
        });

    companyPoints
        .append("circle")
        .attr("r", 18 / zoom.scale())
        .attr("class", "company-circ")
        .attr("fill", "#85A5CC")//, function(d) { return color(d.company_type) });

    var toxicsG = svg.append("g")
        .attr("id", "toxicsG")
        .attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");

    var toxicPoints = toxicsG.selectAll(".toxics")
        .data(ca_toxics)
      .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")scale(" + projection.scale() + ")"
        })
        .on("mouseover", function(d,i) {
          tooltip.transition().duration(200).style("opacity", .8);
          tooltip.html("<br>" + "<strong>" + "TOXIC LEAK/SPILL" + "</strong><br>" + d.company.toTitleCase() + "" +
                  "<br>" + "Address: " + d.address.toTitleCase() + "<br>" +
                  (d.company_type?"<br>" + "Company type: " + d.company_type:"") + "<br>" +
                  (d.source?"<hr>"+ "Source: " + d.source:""))
        })
        .on("mouseout", function(d,i) {
          tooltip.transition().duration(500).style("opacity", 0);
        });

   toxicPoints 
        .append("circle")
        .attr("r", 18 / zoom.scale())
        .attr("class", "toxics-circ")
        .attr("fill", "#333");

  zoomed();

};

function zoomed() {
    var tiles = tile
        .scale(zoom.scale())
        .translate(zoom.translate())
        ();

    vector
        .attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
        .style("stroke-width", 1 / zoom.scale());

    d3.select("#companiesG")
        .attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");

    d3.selectAll(".company-circ")
        .attr("r", 20 / zoom.scale())
        .style("stroke-width", 1 / zoom.scale());

    d3.select("#superfundG")
      .attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");

    d3.selectAll(".superfund-circ")
      .attr("r", 60 / zoom.scale())
      .style("stroke-width", 1 / zoom.scale());

    d3.select("#toxicsG")
      .attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");

    d3.selectAll(".toxics-circ")
      .attr("r", 18 / zoom.scale())
      .style("stroke-width", 1 / zoom.scale());

    var image = raster
        .attr("transform", "scale(" + tiles.scale + ")translate(" + tiles.translate + ")")
        .selectAll("image")
        .data(tiles, function (d) {
            return d;
        });

    image.exit()
        .remove();

    image.enter().append("image")
        .attr("xlink:href", function(d) { return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/examples.map-i86nkdio/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; }) // ".tile.stamen.com/terrain/"
        .attr("width", 1)
        .attr("height", 1)
        .attr("x", function (d) {
            return d[0];
        })
        .attr("y", function (d) {
            return d[1];
        });

    // d3.selectAll("path")
    //   .attr("d", geoPath);
}

// Used for the check boxes to turn off and on elements
function filterPoints(pointData) {
  if(d3.selectAll(pointData).style("display") == "none") {
    d3.selectAll(pointData).style("display", "block")
  } else {
  d3.selectAll(pointData).style("display", "none")
  }
}

// Used for the field selector to filter company types
function fieldSelected() {
  // field = companyTypes;
  //console.log(field);
  key = this.selectedIndex.value;
  console.log(key);

  d3.selectAll(".company-circ")
    .transition()
    .duration(300)
    .style("display", function(d,i) {
      if (key == d.company_type) {
        return "block"
      } else {
        return "none" }
    ;})
}

// Used for the check boxes to turn off and on elements
function colorByCompanyType(colorPoints) {
  if(d3.selectAll(colorPoints).style("fill") == "#FFB100") {
    d3.selectAll(colorPoints).style("fill", function(d,i) { return color(d.company_type)} )
  } else {
  d3.selectAll(colorPoints).style("fill", "#FFB100")
  }
}

// Function for correcting to title case
String.prototype.toTitleCase = function() {
  var i, j, str, lowers, uppers;
  str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string
  lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
  'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
  for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
      function(txt) {
        return txt.toLowerCase();
      });

  // Certain words such as acronyms should be left uppercase. Customize as needed.
  uppers = ['Id', 'Tv','Ca'];
  for (i = 0, j = uppers.length; i < j; i++)
     str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
       uppers[i].toUpperCase());

  return str;
}

var toggleColor = (function() {
  var currentColor = "#FFB100";
  return function(){
    currentColor = currentColor == "#FFB100" ? "" : "#FFB100";
    d3.select(this).attr("class", "selected");
  }
});
