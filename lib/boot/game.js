/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var CreationBoardView = require('../view/creationboard');
var Game = require('../model/game');
var GameContentView = require('../view/gamecontent');


function initGame(creator, opts) {
  var game = new Game(opts.game);
  var opponentColor = game.get('creator') === 'black' ? 'white' : 'black';
  game.set('color', !!creator ?  opts.creator : opponentColor);

  var gameContentView = new GameContentView({model: game});

  $('mei-content').append(gameContentView.render().el);
  gameContentView.resize();
  
  $(window).on('resize', gameContentView.resize);
  $('mei-layout-sandwich').removeClass('closed');

  _.delay(function () {
    $('mei-board-creation').addClass('closed');
  }, 1000);
}

/* Boot method */

window.boot = function (opts) {
  var socket = io.connect();
  
  if (!opts.game) {
    socket.once('game:created', _.bind(initGame, this, true));

    $('mei-layout-sandwich')
      .addClass('closed')
      .append(new CreationBoardView({
        id: opts.id,
        socket: socket
      }).render().el);
  } else {
    initGame(false, opts);
  }
};


/* Link Backbone to Zepto */

Backbone.$ = Zepto;