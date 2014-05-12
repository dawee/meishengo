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

game.registerPlayer = function (socket, id, color) {
  socket.on('stone:put', _.bind(game.putStone, this, id, color, socket));
};

/* Put stone on goban and echo result */

game.putStone = function (id, color, socket, data) {
  var io = game.io;

  if (data.stone.color !== color) return;

  GameStore.fetch(id, function (err, game) {
    if (err) return;
    if (!game.putStone(data.stone)) return;

    io.sockets.in('game:' + id).emit('game:updated', {game: game.serialize()});
    game.save();
  });
};