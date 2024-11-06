---
title: "San Jose Annexations, 1850—2000"
abstract: 'After 1945, the City of San Jose embarked on an aggressive
    annexation campaign in the Bay Area with the intent of becoming the
    "Los Angeles of the North."'
date: 2021-11-24 19:31:46
permalink: /visualizations/sanjose/
layout: page
extra_css: annexation.css
visualization: annexation_sanjose.js
script: viz/sanjose-annexations/main.js
styles: viz/sanjose-annexations/style.css
thumbnail: annexation_preview.png
thumbdesc: "Annexations in San Jose, California"
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<div id="map"></div>


<div id="content" class="container mx-auto px-4 sm:px-6 md:px-10 lg:px-24 pt-10">

<div id="year-buttons" class="flex flex-wrap justify-center space-x-2 pt-5">
<button 
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 rounded"
        data-year="1850">
        1850
    </button>
    <button 
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
        data-year="1925">
        1925
    </button>
    <button 
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
        data-year="1936">
        1936
    </button>
    <button 
    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
    data-year="1946">
    1946
    </button>
    <button 
    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
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

<p>Until the 1950s, San Jose remained a small town mostly tied to the agricultural industry. As a major fruit producer, market, and distribution center, the town catered to its hinterlands. But industrialists, merchants, and business owners felt that San Jose's reliance on the cyclical and sometimes unsteady agricultural industry undermined the city's attempts to grow. The growth coalition captured a majority on the city council in 1944, and quickly established a new regime dedicated to diversifying the city's industries by courting new high tech and manufacturing businesses.</p>

<p>In the postwar era, San Jose undertook an aggressive annexation campaign
to fold surrounding land and cities into its orbit.
The expansion of San Jose followed from a desire among business leaders, civic leaders, and boosters to improve the city's reputation as well as capture a larger tax base. Reform politicians in the 1940s maintained a belief in the idea that metropolitan growth equaled progress. In San Jose, those candidates formed the Progressive Committee and ousted the city manager, police and fire chiefs, and political bosses from the city's leadership. By the end of the 1940s, Progress Committee candidates and their ideology of growth was fully entrenched in city politics.
</p>

<p>
Growth, however, required funds&#8212;and city residents were rarely willing to allow new property taxes to help fund San Jose's need for new infrastructure. Bond elections throughout the 1940s were repeatedly voted down by residents. City leaders needed a new voice to help convince voters of the need for new taxes, and they found their champion in Anthony "Dutch" Hamann. The forty-year-old former businessman, teacher, and oil company representative had a strong attachment to the city and solid connections throughout the community.<sup id="fnref:1"><a href="#fn:1" class="footnote" rel="footnote">1</a></sup> Hamann had not served in political office until his appointment by the city council in 1950 in a split 4-to-3 vote. As the city began its drive for urban growth, Hamann hoped to avoid the fate that had befallen his home of Orange County in Southern California with its many competing medium-sized cities. Hamann believed that a large city could better manage urban development and growth than several small towns all looking out for their own interests. He wanted San Jose to dominate the county, and thus avoid what he saw as petty competition among small towns.<sup id="fnref:2"><a href="#fn:2" class="footnote" rel="footnote">2</a></sup> To grow and make available the funds to sustain growth, Hamann reasoned, the city needed to annex land to raise revenue from taxes.<sup id="fnref:3"><a href="#fn:3" class="footnote" rel="footnote">3</a></sup> "You don't build a city by staying in a vacuum," Hamann declared. "You build, you sell. . . . And I was the gun for hire."<sup id="fnref:4"><a href="#fn:4" class="footnote" rel="footnote">4</a></sup>
</p>

<h5 class="text-center text-base font-semibold mb-4">Santa Clara County Population</h5>

<div class="flex justify-center text-base">
    <table class="table-auto border-collapse border border-gray-300">
        <thead>
            <tr class="bg-gray-200">
                <th class="px-4 py-2 border border-gray-300 text-center">Year</th>
                <th class="px-4 py-2 border border-gray-300 text-center">Population</th>
                <th class="px-4 py-2 border border-gray-300 text-center">%±</th>
            </tr>
        </thead>
        <tbody>
            <tr class="row-1950">
                <td class="border px-4 py-2 text-center">1950</td>
                <td class="border px-4 py-2 text-center">290,547</td>
                <td class="border px-4 py-2 text-center">66.1%</td>
            </tr>
            <tr class="row-1960">
                <td class="border px-4 py-2 text-center">1960</td>
                <td class="border px-4 py-2 text-center">642,315</td>
                <td class="border px-4 py-2 text-center">121.1%</td>
            </tr>
            <tr class="row-1970">
                <td class="border px-4 py-2 text-center">1970</td>
                <td class="border px-4 py-2 text-center">1,064,714</td>
                <td class="border px-4 py-2 text-center">65.8%</td>
            </tr>
            <tr class="row-1980">
                <td class="border px-4 py-2 text-center">1980</td>
                <td class="border px-4 py-2 text-center">1,295,071</td>
                <td class="border px-4 py-2 text-center">21.6%</td>
            </tr>
            <tr class="row-1990">
                <td class="border px-4 py-2 text-center">1990</td>
                <td class="border px-4 py-2 text-center">1,497,577</td>
                <td class="border px-4 py-2 text-center">15.6%</td>
            </tr>
            <tr class="row-2000">
                <td class="border px-4 py-2 text-center">2000</td>
                <td class="border px-4 py-2 text-center">1,682,585</td>
                <td class="border px-4 py-2 text-center">12.4%</td>
            </tr>
            <tr class="row-2010">
                <td class="border px-4 py-2 text-center">2010</td>
                <td class="border px-4 py-2 text-center">1,781,642</td>
                <td class="border px-4 py-2 text-center">5.9%</td>
            </tr>
        </tbody>
    </table>
</div>

<p>
And build San Jose did. The city approved over 1,400 annexations between 1945 and 1970 including many narrow strips&#8212;"shoestring" annexations&#8212;snaking outward, sometimes only on one half of a street, to capture a desirable subdivision, commercial center, or street intersection. In some areas, annexations became a tool of coercion. Annex enough areas around land-owning hold-outs, city officials reasoned, and pockets of non-annexed land would have little choice but to succumb.<sup id="fnref:5"><a href="#fn:5" class="footnote" rel="footnote">5</a></sup> Hamann's drive for land became so aggressive that his staff became known as "Dutch's Panzer division"&#8212;named after the swift motorized armored tank squadrons of the Third Reich&#8212;as annexations sprawled outward from the city core.<sup id="fnref:6"><a href="#fn:6" class="footnote" rel="footnote">6</a></sup> "They say San Jose is going to become another Los Angeles," Hamann rebuked his critics. "Believe me, I'm going to do the best in my power to make that come true."<sup id="fnref:7"><a href="#fn:7" class="footnote" rel="footnote">7</a></sup> Under Hamann's tenure, the San Jose Chamber of Commerce spent nearly $1 million to attract new industries to the city. The population boomed and the city sprawled. "It was just growth, growth, growth," Al Ruffo, San Jose's mayor in the 1940s, recalled approvingly. "That was everybody's song. And Dutch sang it the loudest."<sup id="fnref:8"><a href="#fn:8" class="footnote" rel="footnote">8</a></sup>
</p>

<p>The city continued its growth campaign until the mayoral elections of 1974. By the 1970s, a wave of anti-growth and slow-growth advocates began challenging the growth coalition's insistence on urban-expansion-as-progress, citing rising taxes, substandard city services, and the erosion of natural areas as signs that the city had gone too far. Citizens elected Janet Gray Hayes, a self-avowed environmentalist, as mayor in 1974. Among her policies was a shift to "in-fill," promoting the city to fill in areas of the city it already contained rather than continue to expand outward.</p>

<hr/>

<div class="footnotes text-sm">
<ol>
<li id="fn:1">
<p>Trounstine and Christensen, <em>Movers and Shakers</em>, 89; Arbuckle, <em>San Jose</em>, 44-45. Hamann had graduated from the University of Santa Clara and played on the same football team as Councilman Al Ruffo. <a href="#fnref:1" class="reversefootnote">&#8617;</a></p>
</li>
<li id="fn:2">
<p>"Hamann: San Jose's Growth Guru," <em>San Jose Mercury</em>, 1999. <a href="#fnref:2" class="reversefootnote">&#8617;</a></p>
</li>
<li id="fn:3">
<p>Glenna Matthews, <em>Silicon Valley, Women, and the California Dream: Gender, Class, and Opportunity in the Twentieth Century</em> (Stanford: Stanford University Press, 2003), 96. <a href="#fnref:3" class="reversefootnote">&#8617;</a></p>
</li>
<li id="fn:4">
<p>Hamann quoted in Trounstine, and Christensen, Movers and Shakers, 96. <a href="#fnref:4" class="reversefootnote">&#8617;</a></p>
</li>
<li id="fn:5">
<p>"Annexations by Year", 2011, City of San Jose Planning Division; "City Size by Year", 2011, City of San Jose Planning Division; Belser, <em>Planning Progress 1956</em>, 47; Trounstine, and Christensen, <em>Movers and Shakers</em>, 93; "Correcting San Jose's Boomtime Mistake," <em>Business Week</em>, September 19, 1970, 74; Stanford Law Review, <em>San Jose</em>, 5. <a href="#fnref:5" class="reversefootnote">&#8617;</a></p>
</li>
<li id="fn:6">
<p>Trounstine and Christensen, <em>Movers and Shakers</em>, 93. <a href="#fnref:6" class="reversefootnote">&#8617;</a></p>
</li>
<li id="fn:7">
<p>Stanford Law Review, <em>San Jose</em>, 17. <a href="#fnref:7" class="reversefootnote">&#8617;</a></p>
</li>
<li id="fn:8">
<p>"Hamann: San Jose's Growth Guru," <em>San Jose Mercury</em>, 1999. <a href="#fnref:8" class="reversefootnote">&#8617;</a></p>
</li>
</ol>

<hr>

<div class="draft">
<p>Source code: <a 
href="https://github.com/hepplerj/machinesvalley/blob/gh-pages/assets/js/{{ page.visualization }}">Github</a> 
| Last updated: 2024-10-28</p>
</div>

<hr class="pb-4">

<h4 class="text-sm font-bold">Data Sources</h4>
<ul class="text-sm">
<li><a href="https://github.com/hepplerj/machinesvalley/blob/gh-pages/data/census-population/population_bay_area.csv">U.S. Census, 1940&#8212;2010</a></li>
<li>City of San Jose</li>
</ul>

<h4 class="text-sm font-bold">Bibliography</h4>
<ul class="text-sm">
<li>Abbott, Carl. <em>Metropolitan Frontier: Cities in the Modern American West</em>. Tucson: University of Arizona Press, 1995.</li>
<li>Abbott, Carl. <em>How Cities Won the West: Four Centuries of Urban Change in Western North America</em>. Albuquerque: University of New Mexico Press, 2008.</li>
<li>Arbuckle, Clyde. <em>Clyde Arbuckle’s History of San Jose: Chronicling San Jose’s Founding as California’s Earliest Pueblo in 1777, Through Exciting and Tumultuous History Which Paved the Way for Today’s Metropolitan San Jose</em>. San Jose: Smith & McKay, 1985.</li>
<li>Bakken, Gordon Morris, and Brenda Farrington, eds. <em>The Urban West</em>. New York: Garland Pub, 2001.</li>
<li>Matthews, Glenna. <em>Silicon Valley, Women, and the California Dream: Gender, Class, and Opportunity in the Twentieth Century</em>. Stanford: Stanford University Pres, 2003.</li>
<li>Lukes, Timothy J. “Progressivism Off-Broadway: Reform Politics in San Jose, California, 1880-1920.” <em>Southern California Quarterly</em> 76 (December 1994): 377–400.</li>
<li>Mandich, Mitchell. “<a href="http://discover.sjlibrary.org/iii/encore_sjsu/record/C__Rb1503985__SThe%20Growth%20and%20Development%20of%20San%20Jose__Orightresult__U__X6?lang=eng&suite=sjsu.">The Growth and Development of San Jose, California&#8212;Social, Political, and Economic Considerations</a>.” M.A. thesis, San Jose State University, 1975.</li>
<li>Trounstine, Philip and Terry Christensen. <em>Movers and Shakers: The Study of Community Power</em>. New York: St. Martin's Press, 1982.</li>
</ul>
</div>

### Citation

{{<citation>}}

</div>

<script defer>
document.addEventListener('DOMContentLoaded', () => {
  const buttonsContainer = document.getElementById('year-buttons');
  const buttons = buttonsContainer.querySelectorAll('button');

  // Set default active state for 1950
  const defaultButton = buttonsContainer.querySelector('button[data-year="1850"]');
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
