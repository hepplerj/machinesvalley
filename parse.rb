#!/usr/bin/env ruby

# Parse CSV files and convert them to JSON.
# Mostly used for preparing data for D3.js. I don't like using untyped
# CSV files, so this script clean things up for me.

# Usage: ./parse.rb /path/to/input.csv /path/to/output.json

# Jason A. Heppler | jason@jasonheppler.org | jasonheppler.org
# MIT License <https://heppler.mit-license.org/>
#
# Created: 2014-07-10

require 'rubygems'
require 'json'
require 'csv'

def is_int(str)
  return !!(str =~ /^[-+]?[1-9]([0-9]*)?$/)
end

lines = CSV.open(ARGV[0]).readlines
keys = lines.delete lines.first

File.open(ARGV[1], "w") do |f|
  data = lines.map do |values|
    is_int(values) ? values.to_i : values.to_s # figure out why this isn't working
    Hash[keys.zip(values)]
  end
  f.puts JSON.pretty_generate(data)
end
