'use strict';

/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');

/* Boot method */

window.boot = function (opts) {
  _.defer(function () {
    $('h1').removeClass('hidden');
  });
};


/* Link Backbone to Zepto */

Backbone.$ = $;