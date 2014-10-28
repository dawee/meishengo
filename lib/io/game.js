'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var GameStore = require('../store/game');
var Player = require('../model/player');


/* Game callback : listen to game elements */

var game = module.exports = {};

/* Spectate a game */

game.spectate = function (socket, data) {
  GameStore.fetch(data.id, _.bind(function (err, model) {
    if (err) return;

    this.gameId = data.id;
    model.save();
    socket.join('game:' + data.id);
    socket.emit('game:greetings:request');
    socket.on('game:greetings', _.bind(game.greetings, this, socket));
  }, this));
};

/* Greetings are necessary for joining or talking into a game */

game.greetings = function (socket, data) {
  if (!_.has(data, 'nickname')) return;

  GameStore.fetch(this.gameId, _.bind(function (err, model) {
    if (err) return;

    var isBlackPresent = !!model.get('black').get('present');
    var isWhitePresent = !!model.get('white').get('present');

    if (!isWhitePresent || !isBlackPresent) {
      socket.emit('game:player:request', {
        white: !isWhitePresent,
        black: !isBlackPresent
      });      
    }
  }, this));
};

/* Join game as player */

game.join = function (socket, data) {
  if (!_.contains(['black', 'white'], data.color)) return;

  GameStore.fetch(data.id, _.bind(function (err, model) {
    if (err) return;
    if (!!model.get(data.color).get('present')) return;

    this.gameId = data.id;
    this.playerColor = data.color;

    model.get(data.color).set('present', true);
    model.save();

    socket.emit('game:joined', {color: data.color});
    socket.on('stone:put', _.bind(game.putStone, this, socket));
    socket.on('disconnect', _.bind(game.leave, this, socket));
  }, this));
};

/* Leave game (player or observer) */

game.leave = function(socket, data) {
  GameStore.fetch(this.gameId, _.bind(function (err, model) {
    if (err) return;

    if (!!this.playerColor && model.has(this.playerColor)) {
      model.get(this.playerColor).set('present', false);
      model.save();
    }
  }, this));
};

/* Put stone on goban and echo result */

game.putStone = function (socket, data) {
  if (data.stone.color !== this.playerColor) return;

  GameStore.fetch(this.gameId, _.bind(function (err, game) {
    if (err) return;
    if (!game.putStone(data.stone)) return;

    this.io.sockets.in('game:' + this.gameId).emit('game:updated', {
      game: game.serialize()
    });

    game.save();
  }, this));
};