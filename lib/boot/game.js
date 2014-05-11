/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var GobanView = require('../view/goban');

/* Boot method */

window.boot = function (opts) {
  if (!opts.game) {
    _.defer(function () {
      $('mei-layout-sandwich').addClass('closed');
    });
  }
};


/* Link Backbone to Zepto */

Backbone.$ = Zepto;