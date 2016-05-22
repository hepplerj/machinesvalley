require "rake/clean"
#require "stringex"
require "yaml"
require "fileutils"

# Set "rake watch" as default
task :default => :preview

# Load the configuration file
CONFIG = YAML.load_file("_config.yml")

# Get and parse the date
DATE = Time.now.strftime("%Y-%m-%d")

# Directories
POSTS = "source/_posts"
DRAFTS = "source/_drafts"

desc 'default: list available rake tasks'
task :default do
  puts 'Try one of these specific tasks:'
  sh 'rake --tasks --silent'
end

desc "New draft post"
task :draft do |t|
  title = get_stdin("What is the title of the post? ")
  link_check = get_stdin("Is this a link post? (y/n) ")
  link_url = if link_check == "y" then get_stdin("Enter url: ") end
  filename = "_drafts/#{title.to_url}.md"

  puts "Creating new draft: #{filename}"
  open(filename, "w") do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
    post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M')}"
    if link_check == "y" then post.puts "external-url: #{link_url}" end
    if link_check == "n" then post.puts "image: \n    feature: \n    thumb: " end
    post.puts "categories: "
    post.puts "tags: "
    post.puts "..."
  end
end

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

desc "Run the development server"
task :preview do
  sh "jekyll serve --watch"
end # task :preview

desc "Build the production version of the site"
task :build do
  puts "\nBuilding the production version of the site ..."
  ok_failed system "jekyll build"
end # task :build

desc "rsync to server"
task :rsync do
  puts "\nDeploying the site via rsync..."

  ssh_port       = "22"
  ssh_user       = "jasonhep@jasonheppler.org"
  rsync_delete   = true
  rsync_options  = "--checksum --stats -avz -e"
  public_dir     = "_site/"
  document_root  = "~/public_html/dissertation/"

  exclude = ""
  if File.exists?('./rsync-exclude')
    exclude = "--exclude-from '#{File.expand_path('./rsync-exclude')}'"
  end

  ok_failed system("rsync #{rsync_options} 'ssh -p #{ssh_port}' #{exclude} #{"--delete" unless rsync_delete == false} #{public_dir}/ #{ssh_user}:#{document_root}")
end # task :rsync

desc "Build and deploy the production version of the site"
task :deploy => [:build, :rsync]

def get_stdin(message)
  print message
  STDIN.gets.chomp
end

def ok_failed(condition)
  if (condition)
    puts "OK"
  else
    puts "FAILED"
  end
end
