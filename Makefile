sources = $$(find ./lib -name '*.js')
bin := $$(npm bin)
ctime := $$(date +%H:%M:%S)

all: build

run: css-dev js-dev
	@title="Mei ${ctime}" debug=true node app.js

prepare-build:
	@mkdir -p build

build: js css

js-dev: prepare-build
	@${bin}/browserify -t aliasify -t jadeify lib/boot/game.js -o build/game.js
	@${bin}/browserify -t aliasify -t jadeify lib/boot/landing.js -o build/landing.js

js: js-dev
	@${bin}/uglifyjs build/game.js > build/game.min.js
	@${bin}/uglifyjs build/landing.js > build/landing.min.js

css-dev: prepare-build
	@${bin}/lessc lib/style/game.less build/game.css
	@${bin}/lessc lib/style/landing.less build/landing.css

css: css-dev
	@${bin}/cleancss -o build/game.min.css build/game.css
	@${bin}/cleancss -o build/landing.min.css build/landing.css

test:
	@${bin}/mocha --recursive -R nyan

lint:
	@${bin}/jshint ${sources}

clean:
	@rm -rf build

validate: lint test


.PHONY: build test
