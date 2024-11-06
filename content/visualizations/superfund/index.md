---
title: "The Pollution Landscape, 1970—2000"
abstract: "In 1982 news broke that Fairchild Semiconductor's manufacturing facility in South San Jose had leaked industrial solvents into the soil and groundwater, affecting nearby drinking wells operated by the Great Oak Water Company that supplied 16,000 residents. By the end of the decade, numerous leaks, spills, and contaminations would be uncovered."
date: 2021-11-24 19:31:46
permalink: /visualizations/superfund/
layout: page
extra_css: annexation.css
visualization: superfund.js
script: viz/superfund/main.js
styles: viz/superfund/style.css
thumbnail: superfund_preview.png
thumbdesc: "Superfund sites in Silicon Valley"
---
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<div class="row">

<div id="viz"></div>

</div>

<div class="flex justify-center mt-4">
  <form role="form" class="flex space-x-4">
    <label class="checkbox-inline flex items-center space-x-2">
      <input id="showsuperfund" type="checkbox" data-filter=".superfund-circ" checked>
      <div class="w-4 h-4" style="background-color: #d95f02;"></div>
      <span>Show Superfund sites</span>
    </label>
    <label class="checkbox-inline flex items-center space-x-2">
      <input id="showcompanies" type="checkbox" data-filter=".company-circ" checked>
      <div class="w-4 h-4" style="background-color: #7570b3;"></div>
      <span>Show companies</span>
    </label>
    <label class="checkbox-inline flex items-center space-x-2">
      <input id="showtoxics" type="checkbox" data-filter=".toxics-circ" checked>
      <div class="w-4 h-4" style="background-color: #1b9e77;"></div>
      <span>Show toxic sites and spills</span>
    </label>
  </form>
</div>

  <div id="content" class="container mx-auto px-4 sm:px-6 md:px-10 lg:px-24 pt-10">
    <div class="col-md-8">

<p>
In December 1981, Fairchild Semiconductor identified a chemical leak in one of its solvents storage tanks in South San Jose. A nearby well operated by the Great Oakes Water Company was discovered contaminated and promptly shut down, but neighbors in the area had for years wondered about the miscarriages, birth defects, stillbirths, and other health issues affecting their families. When news of the chemical leak broke in January 1982, neighborhoods began to question just how clean the "clean" industries of high tech really were. Subsequent investigations by state, county, and city government and the Environmental Protection Agency discovered widespread chemical leaks throughout the San Francisco Peninsula, many of which became eligible for Superfund funding. Out of twenty-nine sites investigated by the EPA, twenty-four were placed on the National Priorities List and designated Superfund sites. Santa Clara County has more Superfund sites than any other county in the United States.
</p>

<p>
Superfund&#8212;the name given to hazardous waste sites under the fund established by the Comprehensive Environmental Response, Compensation, and Liability Act (CERCLA) of 1980&#8212;provides funding to clean-up efforts and grants the EPA additional power in compelling those responsible for toxic waste to perform cleanups or reimburse government-led cleanups.
</p>

<p>
I am interested in the spatial configurations of environmentalism in the Bay Area. This map gives me one way to explore some of those dynamics. Although currently limited in the information it presents, the project will evolve over time to include a timeline slider for visualizing the appearance of tech companies and Superfund sites, allow you to overlay Census data to discern demographic patterns, and overlay environmental layers such as rivers, wilderness areas, open space, and agricultural reserves.
</p>

<h3>Using the Map</h3>

<p>
Zoom closer by double-clicking or scroll the mousewheel up and down. Mouse over the points to view more information about that location. Layers of the map can be toggled off and on with the checkboxes.
</p>

<p>Be aware that I am projecting historical data onto a present-day map, so certain historical realities not reflected in the basemap such as the location of roads and freeways, names of roads and locations, and so on. The basemap used here is primarily for referencing the physical geography of the area.</p>

<hr>

<h3>Citation</h3>

  {{< citation >}}

<hr>

<h3>Credits and Attribution</h3>

<p>Base map provided by <a href="https://mapbox.com">Mapbox</a>. <strong>This is an early draft</strong>. The data on technology companies so far comes from Palo Alto city directories (1954-1972) and <em>Rich's Complete Guide to Santa Clara County's Silicon Valley</em> (1983). Coming soon will be data from the San Jose City Directories, Santa Clara City Directories, Sunnyvale City Directories, and Mountain View City Directories.</p>

<p>If you are interested in contributing to the database, please contact me: <a href="mailto:jason@jasonheppler.org">jason@jasonheppler.org</a>.</p>

</div><!-- .col-md-8 -->

<div class="col-md-4 sidebar">
</div>
