'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var GameStore = require('../store/game');
var Player = require('../model/player');


/* Game callback : listen to game elements */

var game = module.exports = {};

/* Observe game */

game.observe = function (socket, data) {
  GameStore.fetch(data.id, _.bind(function (err, model) {
    if (err) return;

    model.set('observersCount', model.get('observersCount') + 1);
    model.save();

    socket.join('game:' + data.id);
    socket.on('disconnect', _.bind(game.leave, this, socket));
  }, this));
};

/* Join game as player */

game.join = function (socket, data) {
  if (!_.contains(['black', 'white'], data.color)) return;

  GameStore.fetch(data.id, _.bind(function (err, model) {
    if (err) return;
    if (model.has(data.color) === true) return;

    this.gameId = data.id;
    this.playerColor = data.color;

    model.set(data.color, new Player());
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

    if (!!this.playerColor) {
      model.unset(this.playerColor);
    } else {
      model.set('observersCount', model.get('observersCount') - 1);
    }

    model.save();

    socket.leave('game:' + data.id);
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