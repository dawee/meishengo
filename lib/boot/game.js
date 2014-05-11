/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var CreationBoardView = require('../view/creationboard');

function initGame(opts) {
  $('mei-layout-sandwich').removeClass('closed');
  _.delay(function () {
    $('mei-board-creation').addClass('closed');
  }, 1000);
}

/* Boot method */

window.boot = function (opts) {
  var socket = io.connect();
  
  if (!opts.game) {
    socket.once('game:created', initGame);

    $('mei-layout-sandwich')
      .addClass('closed')
      .append(new CreationBoardView({
        id: opts.id,
        socket: socket
      }).render().el);
  } else {
    initGame(opts);
  }
};


/* Link Backbone to Zepto */

Backbone.$ = Zepto;