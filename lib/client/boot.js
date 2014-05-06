/*
 * Module dependencies
 */

var Backbone = require('backbone');


/* Boot method */

window.boot = function () {
  window.Stone = require('../model/stone');
  window.Backbone = require('backbone');
};


/* Link Backbone to Zepto */

Backbone.$ = Zepto;