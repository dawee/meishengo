client_src := $(wildcard lib/client/*.js)

client:
	@./node_modules/.bin/browserify -o public/koban-client.js ${client_src}

run: client
	@node app.js