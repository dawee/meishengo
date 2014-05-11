/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var CreationBoardView = require('../view/creationboard');
var Game = require('../model/game');
var GobanView = require('../view/goban');


function initGame(opts) {
  var game = new Game(opts.game);

  var geom = function () {
    var contentHeight = $('mei-content').height();
    var dim = contentHeight * 0.9;
    var margin = (contentHeight - dim) / 2;

    return {
      top: margin,
      left: margin,
      width: dim,
      height: dim
    };
  };

  $('mei-content').append(new GobanView({
    model: game.gbn(),
    geom: geom()
  }).render().el);  

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