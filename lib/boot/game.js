'use strict';

/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');
var Backbone = require('backbone');
var CreationBoardView = require('../view/creationboard');
var Game = require('../model/game');
var GameContentView = require('../view/gamecontent');


/* Initialize and append the game content */

function initGame(socket, opts) {
  var game = new Game(opts.game);
  var gameContentView = new GameContentView({
    model: game,
    socket: socket
  });

  $('.mei-content').append(gameContentView.render().el);
  gameContentView.resize();
  
  $(window).on('resize', gameContentView.resize);
  $('.mei-layout-sandwich').removeClass('closed');
  $('.mei-board-creation').addClass('closed');
}

/* Boot method */

window.boot = function (opts) {
  var socket = io.connect('http://' + window.location.hostname + ':' + opts.port);
  
  if (!opts.game) {
    socket.once('game:created', _.bind(initGame, this, socket));

    $('.mei-layout-sandwich')
      .addClass('closed')
      .append(new CreationBoardView({
        id: opts.id,
        socket: socket
      }).render().el);
  } else {
    initGame(socket, opts);    
    
    // Auto join game

    _.any(['black', 'white'], function (color) {
      if (!opts.game[color] || !opts.game[color].present) {
        socket.emit('game:join', {id: opts.id, color: color});
        return true;
      }
    });

  }
};


/* Link Backbone to Zepto */

Backbone.$ = $;