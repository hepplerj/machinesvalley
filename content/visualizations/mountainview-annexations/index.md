---
title: "Mountain View Annexations, 1950—1990"
abstract: "Mountain View underwent dramatic expansion like many of the Bay Area cities in the postwar era."
date: 2021-11-24 19:31:46
permalink: /visualizations/mountainview/
layout: page
extra_css: annexation.css
visualization: annexation_mountainview.js
script: viz/mountainview-annexations/main.js
styles: viz/mountainview-annexations/style.css
thumbnail: mv_annexation_preview.png
thumbdesc: "Annexations in Mountain View, California"
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<div id="map"></div>

<div class="container mx-auto">

<div id="year-buttons" class="flex flex-wrap justify-center space-x-2 pt-5">
    <button 
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 rounded"
    data-year="1950">
    1950
    </button>
    <button 
    class="bg-green-500 hover:bg-green-700 text-white font-bold text-sm py-2 px-4 rounded"
    data-year="1955">
    1955
    </button>
    <button 
    class="bg-green-500 hover:bg-green-700 text-white font-bold text-sm py-2 px-4 rounded"
    data-year="1960">
    1960
    </button>
    <button 
    class="bg-green-500 hover:bg-green-700 text-white font-bold text-sm py-2 px-4 rounded"
    data-year="1965">
    1965
    </button>
    <button 
    class="bg-green-500 hover:bg-green-700 text-white font-bold text-sm py-2 px-4 rounded"
    data-year="1970">
    1970
    </button>
    <button 
    class="bg-green-500 hover:bg-green-700 text-white font-bold text-sm py-2 px-4 rounded"
    data-year="1975">
    1975
    </button>
    <button 
    class="bg-green-500 hover:bg-green-700 text-white font-bold text-sm py-2 px-4 rounded"
    data-year="1980">
    1980
    </button>
    <button 
    class="bg-green-500 hover:bg-green-700 text-white font-bold text-sm py-2 px-4 rounded"
    data-year="1985">
    1985
    </button>
    <button 
    class="bg-green-500 hover:bg-green-700 text-white font-bold text-sm py-2 px-4 rounded"
    data-year="1990">
    1990
    </button>
</div>

### About the Map

Postwar Mountain View underwent rapid expansion. While not as [aggressive as San Jose](https://en.wikipedia.org/wiki/San_Jose), the city grew rapidly as it absorbed new homeowners and businesses.

<div class="flex justify-center text-base">
    <table class="table-auto border-collapse border border-gray-300">
        <thead>
            <tr class="bg-gray-200">
                <th class="px-4 py-2 border border-gray-300 text-center">Year</th>
                <th class="px-4 py-2 border border-gray-300 text-center">Population</th>
            </tr>
        </thead>
        <tbody>
            <tr class="row-1950">
                <td class="border px-4 py-2 text-center">1950</td>
                <td class="border px-4 py-2 text-center">6,563</td>
            </tr>
            <tr class="row-1960">
                <td class="border px-4 py-2 text-center">1960</td>
                <td class="border px-4 py-2 text-center">30,889</td>
            </tr>
            <tr class="row-1970">
                <td class="border px-4 py-2 text-center">1970</td>
                <td class="border px-4 py-2 text-center">51,092</td>
            </tr>
            <tr class="row-1980">
                <td class="border px-4 py-2 text-center">1980</td>
                <td class="border px-4 py-2 text-center">58,655</td>
            </tr>
            <tr class="row-1990">
                <td class="border px-4 py-2 text-center">1990</td>
                <td class="border px-4 py-2 text-center">67,460</td>
            </tr>
            <tr class="row-2000">
                <td class="border px-4 py-2 text-center">2000</td>
                <td class="border px-4 py-2 text-center">70,708</td>
            </tr>
        </tbody>
    </table>
</div>

Mountain View remains a place in high-tech lore: the famous restaurant, Walker's Wagon Wheel, was a popular hangout for Fairchild Semiconductor employees along Whisman Road, where many companies were founded. (The journalist Don Hoefler, credited with putting the nickname "Silicon Valley" into print for the first time, referred to his barstool at the Wagon Wheel as his "field office.")[^1] High-tech fabrication and manufacturing congregated here, including Fairchild Semiconductor, GTE, Intel, Mitsubishi, NEC, and Raytheon, all of which also took advantage of their close proximity to Moffett Airfield nearby. Mountain View was a key site for semiconductor manufacturing throughout the twentieth century and, incidentally, became [one of the most polluted as well](/visualizations/superfund/).

### Citation

{{<citation>}}

[^1]: Margaret O'Mara, _The Code: Silicon Valley and the Remaking of America_ (New York: Penguin Press, 2019), p. 100.

</div>

<script defer>
document.addEventListener('DOMContentLoaded', () => {
  const buttonsContainer = document.getElementById('year-buttons');
  const buttons = buttonsContainer.querySelectorAll('button');

  // Set default active state for 1950
  const defaultButton = buttonsContainer.querySelector('button[data-year="1950"]');
  defaultButton.classList.remove('bg-green-500', 'hover:bg-green-700');
  defaultButton.classList.add('bg-blue-500', 'hover:bg-blue-700');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      buttons.forEach(btn => {
        btn.classList.remove('bg-blue-500', 'hover:bg-blue-700');
        btn.classList.add('bg-green-500', 'hover:bg-green-700');
      });

      // Add active class to the clicked button
      button.classList.remove('bg-green-500', 'hover:bg-green-700');
      button.classList.add('bg-blue-500', 'hover:bg-blue-700');
    });
  });
});
</script>
