  /* Variable delcarations */
  var map,
      path,
      data = {},
      projection,
      tooltip,

      // Map layers
      usa_background_layer,
      county_layer,
      tract_layer,
      cities_layer,
      labels_layer,

      // Time variables
      current_year = "1960",
      min_year,
      max_year;

  // Declare data types
  var rateById = d3.map(),
      averagesByYear = [],
      labelData = d3.map();

  // Store filenames
  var all_data_src = "census.csv",
      all_tracts_src = "topojson/scc-1970.geojson",
      all_cities_src = "topojson/cities/cities_wgs84_topo.json";

  // Format
  var formatPercent = d3.format("0.%");

  // Color scales
  var regionColor = ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548','#d7301f','#b30000','#7f0000'],
      brewer = ["", "q0-9", "q1-9", "q2-9", "q3-9", "q4-9", "q5-9", "q6-9", "q7-9", "q8-9"];

  // Map types
  maps = {
    "percentageBlack_1960": {
      "field": "percentageBlack_1960",
      "label": "Black population, proportion (1960)"
    },
    "percentageWhite_1960": {
      "field": "percentageWhite_1960",
      "label": "White population, proportion (1960)"
    },
    "percentageOther_1960": {
      "field": "percentageOther_1960",
      "label": "Other population, proportion (1960)"
    },
    "totalPopulation_1960": {
      "field": "totalPopulation_1960",
      "label": "Total population (1960)"
    },
    "totalPopulationDensity_1960": {
      "field": "totalPopulationDensity_1960",
      "label": "All persons/mile² (1960)"
    },

    "percentageBlack_1970": {
      "field": "percentageBlack_1970",
      "label": "Black population, proportion (1970)"
    },
    "percentageWhite_1970": {
      "field": "percentageWhite_1970",
      "label": "White population, proportion (1970)"
    },
    "percentageOther_1970": {
      "field": "percentageOther_1970",
      "label": "Other population, proportion (1970)"
    },
    "totalPopulation_1970": {
      "field": "totalPopulation_1970",
      "label": "Total population (1970)"
    },
    "totalDensity_1970": {
      "field": "totalDensity_1970",
      "label": "All persons/mile² (1970)"
    },

    "percentageBlack_1980": {
      "field": "percentageBlack_1980",
      "label": "Black population, proportion (1980)"
    },
    "percentageWhite_1980": {
      "field": "percentageWhite_1980",
      "label": "White population, proportion (1980)"
    },
    "percentageOther_1980": {
      "field": "percentageOther_1980",
      "label": "Other population, proportion (1980)"
    },
    "totalPopulation_1980": {
      "field": "totalPopulation_1980",
      "label": "Total population (1980)"
    },
    "totalDensity_1980": {
      "field": "totalDensity_1980",
      "label": "All persons/mile² (1980)"
    }
  };

  // Default data type and key array for multivariate filtering
  var keyArray = Object.keys(maps);
  var expressed = keyArray[0]; // default

  // Tooltip
  var tooltip = d3.select("body").append("div")
    .classed("tooltip", true)
    .classed("hidden", true);

  // Field selector for map types
  var fieldSelector = d3.select("#field-selector")
        .on("change", fieldSelected);

  for (var key in maps) {
    fieldSelector.append("option")
    .attr("value", key)
    .text(maps[key].label);
  }

  window.onload = initialize();

  function initialize() {
    setup_map(); 
  }

  function setup_map() {
    queue()
      .defer(d3.csv, "census.csv")
      .defer(d3.json, "topojson/scc-1970.geojson")
      .await(callback);

    function callback(error, csv_data, scc_data) {
      map = d3.carto.map();
      d3.selectAll("#map > .loader").remove();
      d3.select("#map").call(map);

      map.centerOn([-122.15,37.3382],"latlong");
      map.setScale(10);

      csv_data.forEach(function(d, i) {
        scc_data.forEach(function(e, j) {
          if (d.GISJOIN === e.id) {
            e.id === d.GISJOIN
          } 
        });
      });
      console.log(csv_data);

      usa_background_layer = d3.carto.layer.tile();
      usa_background_layer
        .tileType("mapbox")
        .path("hepplerj.d2ec1aca")
        .label("Base")
        .visibility(true);

      tract_layer = d3.carto.layer.geojson();
      tract_layer
        .path(scc_data)
        .label("Tracts")
        .cssClass("tracts")
        .renderMode("svg")
        .clickableFeatures(false)
        .on("load", color_scale);

      // Add layers to the map. NB: ORDER MATTERS!
      map.addCartoLayer(usa_background_layer);
      map.addCartoLayer(tract_layer);

      function color_scale() {
        var feature_data = tract_layer.features();
        var size_extent = d3.extent(feature_data, function(d) { return d.properties[expressed]; });
        var colorize = d3.scale.quantile().domain(size_extent).range(['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548','#d7301f','#b30000','#7f0000']);
        console.log(size_extent);

        d3.selectAll("path.tracts")
          .style("fill", function(d) { return colorize(d.properties[expressed]); });
      }
    
    }
  }

  function add_tooltips(d) {
    d3.selectAll("path.tracts")
      .on("mousemove", function(d, i) {
        console.log("moused over");
        var mouse = d3.mouse(d3.select("body").node());
        tooltip
          .classed("hidden", false)
          .attr("style", "left:" + (mouse[0] + 20) + "px; top:" + (mouse[1] - 100) + "px")
          .html(tooltipText(d));
      })
      .on("mouseout", function(d, i) {
        console.log("mousedout");
        tooltip.classed("hidden", true);
      });
  }

  function tooltipText(props) {
    return
    '<h4>Population Figures</h4>' +
    '<b>' + props.AREANAME + '</b><br />' +
    '<table>' +
    '<tr>' +
    "<td class='field'>African American proportion: " +
    "<td>" + percentageFormat(props.percentageBlack) + "</td>" +
    "</tr><tr>" +
    "<td  class='field'>African American density: " +
    "<td>" + densityFormat(props.densityBlack) + " persons/mile²</td>" +
    "</tr><tr>" +
    "<td  class='field'>African American total: " +
    "<td>" + densityFormat(props.BLACK) + " persons</td>" +
    "</tr><tr>" +

    "<td class='field'>White proportion: " +
    "<td>" + percentageFormat(props.percentageWhite) + "</td>" +
    "</tr><tr>" +
    "<td  class='field'>White density: " +
    "<td>" + densityFormat(props.densityWhite) + " persons/mile²</td>" +
    "</tr><tr>" +
    "<td  class='field'>White total: " +
    "<td>" + densityFormat(props.WHITE) + " persons</td>" +
    "</tr><tr>" +

    "<td class='field'>Other proportion*: " +
    "<td>" + percentageFormat(props.percentageOther) + "</td>" +
    "</tr><tr>" +
    "<td  class='field'>Other density*: " +
    "<td>" + densityFormat(props.densityOther) + " persons/mile²</td>" +
    "</tr><tr>" +
    "<td  class='field'>Other total*: " +
    "<td>" + densityFormat(props.OTHER) + " persons</td>" +
    "</tr><tr>" +

    "<td class='field'>Total Tract Population: " +
    "<td>" + densityFormat(props.totalPopulation) + "</td>" +
    "</tr><tr>" +
    "<td  class='field'>Total Density: " +
    "<td>" + densityFormat(props.totalPopulationDensity) + " persons/mile²</td>" +
    "</tr>" +
    '</table>'
    // );
  };

  function fieldSelected() {
    'use strict';
    var field = fieldSelector.node().value;
    expressed = field;
    // console.log(expressed);

    return expressed;
  }

  function update_year() {
    'use strict';

    // Update Year Label
    d3.select("#year")
      .text(current_year);

    // Adjust Previous Year Button
    if (current_year === min_year) {
      d3.select("#prev_btn")
      .attr("disabled", true);
    } else {
      d3.select("#prev_btn")
      .attr("disabled", null);
    }

    // Adjust Next Year Button
    if (current_year === max_year) {
      d3.select("#next_btn")
      .attr("disabled", true);
    } else {
      d3.select("#next_btn")
      .attr("disabled", null);
    }

    // update_counties();
    // update_chart();
  }

  function update_legend() {
    var linear = d3.scale.linear()
      .domain([0,10])
      .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]);

    var svg = d3.select("#legend");

    svg.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(20,20)");

    var legendLinear = d3.legend.color()
      .shapeWidth(30)
      .cells(10)
      .orient('horizontal')
      .scale(linear);

    svg.select(".legendLinear")
      .call(legendLinear);
  }

  // ZoomTo features when clicking on links in the narrative.
  d3.select("#epa").on("click", function() {
    var epa = [[-122.116105, 37.484038], [-122.156112, 37.451938]];
    map.zoomTo(epa, "latlong", 0.9, 4000)
  })

  d3.select("#san-jose").on("click", function() {
    var sj = [[-121.923695, 37.469538], [-122.047265, 37.412111]];
    map.zoomTo(sj, "latlong", 0.9, 4000)
  })

  d3.select("#alviso").on("click", function() {
    var alviso = [[-121.923695, 37.46538], [-122.047265, 37.412111]];
    map.zoomTo(alviso, "latlong", 0.7, 4000)
  })
