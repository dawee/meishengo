/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var CreationBoardView = require('../view/creationboard');
var Game = require('../model/game');
var GobanView = require('../view/goban');


function initGame(creator, opts) {
  var game = new Game(opts.game);
  var opponentColor = game.get('creator') === 'black' ? 'white' : 'black';

  game.set('color', !!creator ?  opts.creator : opponentColor);

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

  var gobanView = new GobanView({
    model: game.gbn(),
    geom: geom()
  });

  $('mei-content').append(gobanView.render().el);  

  $(window).on('resize', function () {
    gobanView.resize(geom());
  });
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