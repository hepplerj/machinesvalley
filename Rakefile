require "rubygems"
require 'rake'
require 'yaml'
require 'time'

SOURCE = "."
CONFIG = {
  'layouts' => File.join(SOURCE, "_layouts"),
  'posts' => File.join(SOURCE, "_posts"),
  'post_ext' => "md"
}

desc 'default: list available rake tasks'
task :default do
  puts 'Try one of these specific tasks:'
  sh 'rake --tasks --silent'
end

desc "give title as argument and create new post"
# usage: rake item title="Post Title Goes Here" tags="tag1, tag2" date="1991-01-01"
task :archive do
  title = ENV["title"] || "new-post"
  tags = ENV["tags"] || "tags"
  item_date = ENV["date"] || "item-date"

  filename = "#{Time.now.strftime('%Y-%m-%d')}-#{title.gsub(/\s/, '-').downcase}.md"
  path = File.join("_posts", filename)

  category = ENV["category"] || "archive"

  if File.exist? path; raise RuntimeError.new("File already exists. Won't clobber #{path}"); end
  File.open(path, 'w') do |file|
    file.write <<-EOS
---
layout: post
title: #{title}
description: 
created_date: #{Time.now.strftime('%Y-%m-%d %H:%M')}
item_date: #{item_date}
image:
  feature:
  thumb:
item_files: _archive/_EDIT_
category: [#{category}]
tags: [#{tags}]
---
EOS
    end
    puts "Now opening #{path} in vim..."
    system "vim #{path}"
end # task:post

# Usage: rake page name="about.html"
# You can also specify a sub-directory path.
# If you don't specify a file extention we create an index.html at the path specified
desc "Create a new page."
task :page do
  name = ENV["name"] || "new-page.md"
  filename = File.join(SOURCE, "#{name}")
  filename = File.join(filename, "index.html") if File.extname(filename) == ""
  title = File.basename(filename, File.extname(filename)).gsub(/[\W\_]/, " ").gsub(/\b\w/){$&.upcase}
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end

  mkdir_p File.dirname(filename)
  puts "Creating new page: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: page"
    post.puts "title: \"#{title}\""
    post.puts 'description: ""'
    post.puts "---"
  end
end # task :page

task :shapefiles do
  sh "ogr2ogr -f GeoJSON geo.json \
  ~/git/research-data/nhgis-shapefiles/state_1870/US_state_1870.shp \
  -t_srs EPSG:4326"
  sh "topojson -o state_1870.json  \
  --id-property GISJOIN \
  -p name=STATENAM,gis=GISJOIN \
  -q 5e3 \
  --simplify-proportion 0.30 \
  -- states=geo.json"
  sh "rm geo.json"
end

desc "Run the development server"
task :preview do
  sh "jekyll serve --watch"
end 
