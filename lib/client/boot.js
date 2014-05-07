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

  var $gobanView = new GobanView({
    geom: {
      top: $content.height() * 0.05,
      left: $content.height() * 0.05,
      width: $content.height() * 0.9,
      height: $content.height() * 0.9
    },
    model: new Goban({size: 19})
  });

  $content.append($gobanView.render().el);
  $(window).on('resize', function () {
    $gobanView.resize({
      top: $content.height() * 0.1,
      left: $content.height() * 0.1,
      width: $content.height() * 0.8,
      height: $content.height() * 0.8
    });
  });
};


/* Link Backbone to Zepto */

Backbone.$ = Zepto;