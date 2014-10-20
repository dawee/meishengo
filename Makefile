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
	@${bin}/browserify -t aliasify lib/boot/game.js -o build/game.js

js: js-dev
	@${bin}/uglifyjs build/game.js > build/game.min.js

css-dev: prepare-build
	@${bin}/lessc lib/style/game.less build/game.css

css: css-dev
	@${bin}/cleancss -o build/game.min.css build/game.css

test:
	@${bin}/mocha -b -R spec

lint:
	@${bin}/jshint ${sources}

clean:
	@rm -rf build

validate: lint test


.PHONY: build test
