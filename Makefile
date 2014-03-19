client_src := $(wildcard lib/client/*.js)

client:
	@./node_modules/.bin/browserify -o public/koban-client.js ${client_src}

run:
	@./node_modules/.bin/watchify -o public/koban-client.js ${client_src} &
	@./node_modules/.bin/nodemon --ignore lib/client app.js &