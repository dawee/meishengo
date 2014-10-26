'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var $ = require('zepto').$;


var game = module.exports = {};


/* Start conversation with existing game */

game.connect = function (socket, layout) {
  var bootTime = Date.now();

  socket.on('game:player:required', function (data) {
    layout.showJoiningForm();
  });

  socket.emit('game:observe', layout.model.toJSON());
};

/* Wait for creation board submit event to create new game */

game.listenGameCreation = function (socket, creationBoard, layout) {
  socket.once('game:created', function (data) {
    creationBoard.close();
    layout.model.set(data.game);
    layout.openToContent();
    _.delay(_.partial(game.connect, socket, layout), 2000);
  });

  creationBoard.on('submit', function (data) {
    socket.emit('game:create', creationBoard.model.toJSON());
  });
};

