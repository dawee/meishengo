'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
var _ = require('underscore');
var Backbone = require('backbone');
var gamePlug = require('../plug/game'); 
var CreationBoardView = require('../view/creationboard');
var Game = require('../model/game');
var GameLayout = require('../view/gamelayout');


/* Boot method */

window.boot = function (opts) {
  var socket = io.connect('http://' + window.location.hostname + ':' + opts.port);
  var layout = new GameLayout({model: new Game(opts.game)});
  var creationBoard = new CreationBoardView({
    id: opts.id,
    socket: socket
  });

  // Append Game layout

  $(document.body).append(layout.render().el);

  if (!opts.game) {
    // If no game : show creation board

    gamePlug.create(socket, creationBoard, layout);
    $(document.body).append(creationBoard.render().el);
  } else {
    // If game exists : connect view and socket via the game plug

    layout.model.set(opts.game);
    gamePlug.connect(socket, layout);
  }
};

/* Link Backbone to jBone */

Backbone.$ = $;