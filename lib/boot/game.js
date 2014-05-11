/*
 * Module dependencies
 */

var Backbone = require('backbone');
var CreationBoardView = require('../view/creationboard');

/* Boot method */

window.boot = function (opts) {
  if (!opts.game) {
    $('mei-layout-sandwich')
      .addClass('closed')
      .append(new CreationBoardView().render().el);
  }
};


/* Link Backbone to Zepto */

Backbone.$ = Zepto;