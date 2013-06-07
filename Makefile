SRC = $(wildcard lib/*/*.js)
HTML = $(wildcard lib/*/*.html)
TEMPLATES = $(HTML:.html=.js)
JS = $$(find app.js lib -name "*.js")
JSLINTRC=$$(cat .jslintrc)
JSLINT_OPTIONS=$$(echo $(JSLINTRC))

build: components $(SRC) $(TEMPLATES)
	@./node_modules/component/bin/component build -o ./public/build -n meishengo
	@./node_modules/uglify-js/bin/uglifyjs ./public/build/meishengo.js > ./public/build/meishengo.min.js
	@./node_modules/less/bin/lessc -x ./public/build/meishengo.css > ./public/build/meishengo.min.css
	@rm ./public/build/meishengo.css
	@rm ./public/build/meishengo.js

components: component.json
	@./node_modules/component/bin/component install

%.js: %.html
	@./node_modules/component/bin/component convert $<

clean:
	rm -fr build components $(TEMPLATES) ./public/build/*

run: build
	@node app.js

validate:
	@./node_modules/.bin/purelint $(JS)

.PHONY: clean test run
