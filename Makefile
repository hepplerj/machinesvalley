preview :
	@echo "Serving the preview site with Hugo ..."
	hugo serve --buildDrafts --buildFuture --disableFastRender

build :
	@echo "\nBuilding the site with Hugo ..."
	rm -rf public/*
	hugo --cleanDestinationDir --minify

deploy : build

	rsync --omit-dir-times --exclude-from=rsync-excludes \
		--checksum -avz \
		--itemize-changes \
		public/ reclaim:~/machinesinthevalley.org/ | egrep -v '^\.'

tailwind :
	@echo "\nBuilding the tailwind css ..."
	npx tailwindcss -i ./assets/scss/app.scss -o ./assets/style.css

.PHONY : preview build deploy tailwind
