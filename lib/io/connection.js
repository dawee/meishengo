/*
 * Module dependencies
 */

var _ = require('underscore');
var game = require('./game');
var GameStore = require('../store/game');

var ID_PATTERN = /^[a-z0-9\-]{4,16}$/

/* Connection callback : listen to root elements */

var connection = module.exports = function (socket) {
  socket.on('game:observe', _.bind(game, game, socket));
  socket.on('game:create', _.bind(connection.createGame, this, socket));
};

/* Create the game on redis */

connection.createGame = function (socket, data) {
  console.log(data);
  if (!data.id || !_.isString(data.id) || !data.id.match(ID_PATTERN)) {
    return;
  }

  data = _.extend({size: 19, color: 'black'}, data);

  GameStore.createIfNotExists({
    id: data.id,
    creator: data.color,
    opponent: false,
    goban: {
      size: data.size,
    }
  }, function (err, game) {
    if (err) return console.log(err);

    socket.emit('game:created', {
      color: data.color,
      game: game.serialize()
    });
  });
};