---
layout: single
title: Archive
permalink: /archive/
---

<h2>{{ page.title }} ({{ site.documents | size }} total documents)</h2>

The document archive includes letters, newspaper articles, images, business documents, government documents, and more. 

<table class="table-striped">
	<tr>
		<th>Date</th>
		<th>Note</th>
	</tr>
  {% for note in site.documents %}
    <tr>
    	<td width="20%">{{ note.date | date_to_string }}</td>
    	<td width="50%"><a href="{{ note.url | prepend: site.baseurl | prepend: site.url }}">{{note.title}}</a></td>
    </tr>
  {% endfor %}
</table>