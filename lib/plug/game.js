'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');


var game = module.exports = {};


/* Start conversation with existing game */

game.connect = function (socket, layout) {
  socket.emit('game:observe', layout.model.toJSON());
};

/* Wait for creation board submit event to create new game */

game.listenGameCreation = function (socket, creationBoard, layout) {
  socket.once('game:created', function (data) {
    creationBoard.close();
    layout.model.set(data.game);
    layout.openToContent();
    game.connect(socket, layout);
  });

  creationBoard.on('submit', function (data) {
    socket.emit('game:create', creationBoard.model.toJSON());
  });
};