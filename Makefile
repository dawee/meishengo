bin := ./node_modules/.bin

all: js css

prepare-build:
	@mkdir -p build

js: prepare-build
	@${bin}/browserify -t aliasify lib/boot/game.js -o build/game.js

css: prepare-build
	@${bin}/lessc lib/style/game.less build/game.css

test:
	@${bin}/mocha -b -R spec


.PHONY: test all
