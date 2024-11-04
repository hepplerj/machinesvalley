preview :
	@echo "Serving the preview site with Hugo ..."
	hugo serve --buildDrafts --buildFuture --disableFastRender

build : 
	@echo "\nBuilding the site with Hugo ..."

deploy : build
	@echo "\nDeploying the site to dev with rsync ..."

tailwind :
	@echo "\nBuilding the tailwind css ..."
	npx tailwindcss -i ./assets/scss/app.scss -o ./assets/style.css

.PHONY : preview build deploy tailwind
