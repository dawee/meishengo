'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var GameCache = require('../cache/game');
var Stone = require('../model/stone');

var player = module.exports = {};

/* Pass turn */

player.pass = function (socket, data) {
  GameCache.fetch(this.gameId, _.bind(function (err, model) {
    if (err) return;
    if (this.playerColor !== model.get('turn')) return;

    model.toggleTurn();
    model.save();
    
    this.io.sockets.in('game:' + this.gameId).emit('game:updated', {
      game: model.serialize()
    });

    this.io.sockets.in('game:' + this.gameId).emit('chat:message:system', {
      content: this.nickname + ' passed'
    });
  }, this));
};

/* Put stone on goban and echo result */

player.putStone = function (socket, data) {
  if (data.stone.color !== this.playerColor) return;

  GameCache.fetch(this.gameId, _.bind(function (err, model) {
    var stone = new Stone(data.stone);
    
    if (err) return;
    if (!model.putStone(stone)) return;

    model.save();
    
    this.io.sockets.in('game:' + this.gameId).emit('game:updated', {
      game: model.serialize()
    });

    this.io.sockets.in('game:' + this.gameId).emit('chat:message:system', {
      content: this.nickname + ' played at ' + stone.toPointerString()
    });

  }, this));
};