/*
 * Module dependencies
 */

var _ = require('underscore');
var game = require('./game');


/* Connection callback : listen to root elements */

var connection = module.exports = function (socket) {
  socket.on('game:observe', _.bind(game, game, socket));
};