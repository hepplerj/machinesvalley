---
layout: single
permalink: /blog/
title: Blog
modified: 2014-11-17 20:25:51
tags: [Jason Heppler, digital history, research]
---

## {{ page.title }}

{% for post in site.posts limit:8 %}
<article class="post">
    <h3 class="post-title">
      <a href="{{ post.url }}">{{ post.title }}</a>
    </h3>

    {{ post.content }}

    <div class="meta">
      <span class="glyphicon glyphicon-time" aria-hidden="true"></span> <time datetime="{{ post.date | date_to_xmlschema }}" class="post-date">{{ post.date | date: "%B %e, %Y" | ordinalize  }}</time> &#183; <span class="glyphicon glyphicon-pencil"></span> {{ site.owner.name }} &#183; <span class="glyphicon glyphicon-tag"></span> {{ post.tags | array_to_sentence_string }}
    </div>
</article>
{% endfor %}

