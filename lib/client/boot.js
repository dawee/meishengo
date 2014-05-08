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

  var geom = function () {
    return {
      top: $content.height() * 0.05,
      left: $content.height() * 0.05,
      width: $content.height() * 0.9,
      height: $content.height() * 0.9
    }; 
  };

  window.goban = new Goban({
    size: 19,
    groups: [
      [{row: 0, col: 0, color: 'black'}]
    ]
  });

  var $gobanView = new GobanView({
    geom: geom(),
    model: window.goban 
  });

  $content.append($gobanView.render().el);
  $(window).on('resize', function () {
    $gobanView.resize(geom());
  });
};


/* Link Backbone to Zepto */

Backbone.$ = Zepto;