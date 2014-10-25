'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');


var game = module.exports = {};


/* Start conversation with existing game */

game.connect = function (socket, view) {
  socket.emit('game:observe', view.model.toJSON());

};