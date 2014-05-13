bin := ./node_modules/.bin

all: build

run: build
	@node app.js

prepare-build:
	@mkdir -p build

build: js css

js: prepare-build
	@${bin}/browserify -t aliasify lib/boot/game.js -o build/game.js

css: prepare-build
	@${bin}/lessc lib/style/game.less build/game.css

test:
	@${bin}/mocha -b -R spec


.PHONY: build test all
