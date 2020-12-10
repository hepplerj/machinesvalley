queue()
    .defer(d3.csv, "/data-files/sv-companies/sv_companies.csv")
    .defer(d3.csv, "/data-files/ca-pollution/ca_superfund.csv")
    .defer(d3.csv, "/data-files/ca-pollution/ca_toxic_sites.csv")
    .await(ready);

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 900,
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
//
// var path = d3.geo.path()
//     .projection(projection);

geoPath = d3.geo.path()
    .projection(projection);

var zoom = d3.behavior.zoom()
    .scale(projection.scale() * 2 * Math.PI)
    .scaleExtent([1 << 19, 1 << 26])
    .translate([width - center[0], height - center[1]])
    .on("zoom", zoomed);

// Adjust the projection on the computed center
// so it uses the zoom behavior's translate & scale
// projection
//     .scale(1 / 2 / Math.PI)
//     .translate([0, 0]);

var tooltip = d3.select("#viz").append("div")
    .attr("class", "map-tooltip")
    .style("opacity", 0);

var svg = d3.select("#viz").append("svg")
    .attr("width", width)
    .attr("height", height);

var loading = svg.append("text").attr({x:500,y:250}).text("Loading map...").style("font-size", "26px");

var raster = svg.append("g");
var vector = svg.append("path");

var eventGroup = svg.append("g");

var color = d3.scale.category20b();

// add div attribution
 d3.select("#viz")
   .append("div")
     .attr("class", "attribution")
   .append("label")
     .html("<a href='https://carto.com/attributions' target='_blank'>© CARTO</a> © <OpenStreetMap href='https://www.openstreetmap.org/copyright'>OpenStreetMapOpenStreetMap</a>")

function ready(error, sites, ca_superfund, ca_toxics) {
  if (error) {
      loading.text("Sorry, there has been an error. " +
                   "Please refresh and try again.");
      console.log(error);
  }

  loading.remove();
  svg.call(zoom);

    // Draw Superfund sites
    superfundElements = eventGroup
        .selectAll(".superfunds")
        .data(ca_superfund)
      .enter().append("circle")
        .attr("cx", function(d) { return projection([d.longitude, d.latitude])[0] })
        .attr("cy", function(d) { return projection([d.longitude, d.latitude])[1] })
        .attr("r", 12)
        .attr("class", "superfund-circ")
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

    toxicsElements = eventGroup
        .selectAll(".toxics")
        .data(ca_toxics)
      .enter().append("circle")
        .attr("cx", function(d) { return projection([d.longitude, d.latitude])[0] })
        .attr("cy", function(d) { return projection([d.longitude, d.latitude])[1] })
        .attr("r", 6)
        .attr("class", "toxics-circ")
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

    companyElements = eventGroup
        .selectAll(".companies")
        .data(sites)
      .enter().append("circle")
        .attr("cx", function(d) { return projection([d.longitude, d.latitude])[0] })
        .attr("cy", function(d) { return projection([d.longitude, d.latitude])[1] })
        .attr("r", 3)
        .attr("class", "company-circ")
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

  zoomed();
};

function zoomed() {

  // update projection
  projection
      .scale(zoom.scale() / 2 / Math.PI)
      .translate(zoom.translate());

  // update object positions
  superfundElements
      .attr("cx", function(d) { return projection([d.longitude, d.latitude])[0] })
      .attr("cy", function(d) { return projection([d.longitude, d.latitude])[1] });

  companyElements
      .attr("cx", function(d) { return projection([d.longitude, d.latitude])[0] })
      .attr("cy", function(d) { return projection([d.longitude, d.latitude])[1] });

  toxicsElements
      .attr("cx", function(d) { return projection([d.longitude, d.latitude])[0] })
      .attr("cy", function(d) { return projection([d.longitude, d.latitude])[1] });


    var tiles = tile
        .scale(zoom.scale())
        .translate(zoom.translate())
        ();

    vector
        .attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
        .style("stroke-width", 1 / zoom.scale());

    var image = raster
      .attr("class", "mapG")
        .attr("transform", "scale(" + tiles.scale + ")translate(" + tiles.translate + ")")
        .selectAll("image")
        .data(tiles, function (d) {
            return d;
        });

    image.exit()
        .remove();

    image.enter().append("image")
        .attr("xlink:href", function(d) { return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".basemaps.cartocdn.com/rastertiles/voyager/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
        .attr("width", 1)
        .attr("height", 1)
        .attr("x", function (d) {
            return d[0];
        })
        .attr("y", function (d) {
            return d[1];
        });
}



// Used for the check boxes to turn off and on elements
function filterPoints(pointData) {
  if(d3.selectAll(pointData).style("display") == "none") {
    d3.selectAll(pointData).style("display", "block")
  } else {
  d3.selectAll(pointData).style("display", "none")
  }
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
