'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var game = require('./game');
var GameStore = require('../store/game');

var ID_PATTERN = /^[\w\-]{3,16}$/;

/* Connection callback : listen to root elements */

var connection = module.exports = function (socket) {
  socket.on('game:observe', _.bind(game.observe, this, socket));
  socket.on('game:create', _.bind(connection.createGame, this, socket));
};

/* Generate the model data from event data */

connection.parseGameData = function (data) {
  data = _.extend({size: 19, color: 'black'}, data);

  return {
    id: data.id,
     goban: {
      size: data.size,
    }
  };
};

/* Create the game on redis */

connection.createGame = function (socket, data) {
  if (!data.id || !_.isString(data.id) || !data.id.match(ID_PATTERN)) {
    return;
  }

  GameStore.createIfNotExists(connection.parseGameData(data), _.bind(function (err, model) {
    if (err) return console.log(err);

    socket.emit('game:created', {game: model.serialize()});
  }, this));
};
