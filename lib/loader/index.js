/*global window*/
/*jslint nomen: true*/
"use strict";

var _ = require('underscore'),
    $ = require('jquery'),
    Sonic = require('Sonic');

exports.start = function () {
    exports.stop();
    var height = parseInt($('header').height() * 0.3, 10),
        width = 3 * height,
        square = new Sonic({
            width: width,
            height: height,
            fillColor: '#d6a692',
            path: [
                ['line', 0, 0, width, 0],
                ['line', width, 0, width, height],
                ['line', width, height, 0, height],
                ['line', 0, height, 0, 0]
            ]
        });
    square.play();
    $('header').append(square.canvas);
};

exports.stop = function () {
    $('header .sonic').remove();
};
