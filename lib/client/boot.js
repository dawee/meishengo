/*
 * Module dependencies
 */

var Backbone = require('backbone');
var GobanView = require('./view/goban');
var Goban = require('../model/goban');

/* Boot method */

window.boot = function () {
  window.Stone = require('../model/stone');
  window.Backbone = require('backbone');

  var $content = $('mei-content');

  $content.append(new GobanView({
    geom: {
      top: $content.height() * 0.1,
      left: $content.height() * 0.1,
      width: $content.height() * 0.8,
      height: $content.height() * 0.8
    },
    model: new Goban()
  }).render().el);
};


/* Link Backbone to Zepto */

Backbone.$ = Zepto;