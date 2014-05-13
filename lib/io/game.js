/*
 * Module dependencies
 */

var _ = require('underscore');
var GameStore = require('../store/game');


/* Game callback : listen to game elements */

var game = module.exports = function (socket, data) {
  GameStore.exists(data.id, function () {
    socket.join('game:' + data.id);
  });
};

/* Let socket interract with game as player */

game.registerPlayer = function (socket) {
  socket.on('stone:put', _.bind(game.putStone, this, socket));
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