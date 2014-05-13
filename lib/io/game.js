/*
 * Module dependencies
 */

var _ = require('underscore');
var GameStore = require('../store/game');


/* Game callback : listen to game elements */

var game = module.exports = {};

/* Observe game */

game.observe = function (socket, data) {
  GameStore.exists(data.id, _.bind(function () {
    socket.join('game:' + data.id);
  }, this));
};

/* Join game as player */

game.join = function (socket, data) {
  if (!_.contains(['black', 'white'], data.color)) return;

  GameStore.fetch(data.id, _.bind(function (err, model) {
    if (err) return;
    if (model.get(data.color + 'Present') === true) return;

    this.gameId = data.id;
    this.playerColor = data.color;

    model.set(data.color + 'Present', true);
    model.save();

    socket.emit('game:joined', {color: data.color});
    socket.on('stone:put', _.bind(game.putStone, this, socket));
  }, this));
};

/* Put stone on goban and echo result */

game.putStone = function (socket, data) {
  if (data.stone.color !== this.playerColor) return;

  GameStore.fetch(this.gameId, _.bind(function (err, game) {
    if (err) return;
    if (!game.putStone(data.stone)) return;

    this.io.sockets.in('game:' + this.gameId).emit('game:updated', {game: game.serialize()});
    game.save();
  }, this));
};