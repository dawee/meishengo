SRC = $(wildcard lib/*/*.js)
HTML = $(wildcard lib/*/*.html)
TEMPLATES = $(HTML:.html=.js)
JS = $$(find app.js lib -name "*.js")
JSLINTRC=$$(cat .jslintrc)
JSLINT_OPTIONS=$$(echo $(JSLINTRC))


build: components $(SRC) $(TEMPLATES)
	@./node_modules/component/bin/component build -n meishengo
	@./node_modules/uglify-js/bin/uglifyjs ./build/meishengo.js > ./build/meishengo.min.js
	@./node_modules/less/bin/lessc -x ./build/meishengo.css > ./build/meishengo.min.css
	@rm ./build/meishengo.css
	@rm ./build/meishengo.js

components: component.json
	@./node_modules/component/bin/component install

%.js: %.html
	@./node_modules/component/bin/component convert $<

distclean: clean
	@rm -rf components

clean:
	@rm -fr build $(TEMPLATES) ./build/*

run: clean build
	@node app.js

validate:
	@./node_modules/.bin/purelint $(JS)

.PHONY: clean test run
