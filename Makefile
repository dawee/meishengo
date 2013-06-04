SRC = $(wildcard lib/*/*.js)
HTML = $(wildcard lib/*/*.html)
TEMPLATES = $(HTML:.html=.js)

build: components $(SRC) $(TEMPLATES)
	@component build -o ./public/build -n meishengo
	@uglifyjs ./public/build/meishengo.js > ./public/build/meishengo.min.js
	@lessc -x ./public/build/meishengo.css > ./public/build/meishengo.min.css
	@rm ./public/build/meishengo.css
	@rm ./public/build/meishengo.js

components: component.json
	@component install

%.js: %.html
	@component convert $<

clean:
	rm -fr build components $(TEMPLATES)

run: build
	@node app.js

.PHONY: clean
