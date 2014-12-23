'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var chatroom = require('./chatroom');
var conf = require('../conf');
var GameCache = require('../cache/game');
var Player = require('../model/player');


/* Game callback : listen to game elements */

var game = module.exports = {};


game.sendJoinRequest = function (socket, data) {
  if (this.joinRequestSent || !this.gameId || !this.nickname) return;

  _.bind(chatroom.welcome, this)(socket, data);
  this.io.sockets
    .in('game:' + this.gameId)
    .emit('game:spectator:joined', {
      nickname: this.nickname
    });

  GameCache.fetch(this.gameId, _.bind(function (err, model) {
    if (err) return;

    var blackNickname = model.get('black').get('nickname');
    var whiteNickname = model.get('white').get('nickname');

    if (blackNickname === this.nickname) {
      // Auto join black
      this.playerColor = 'black';
      socket.emit('game:joined', {color: 'black'});
      socket.on('game:stone:put', _.bind(game.putStone, this, socket));
    } else if (whiteNickname === this.nickname) {
      // Auto join white
      this.playerColor = 'white';
      socket.emit('game:joined', {color: 'white'});
      socket.on('game:stone:put', _.bind(game.putStone, this, socket));
    } else if (!whiteNickname || !blackNickname) {
      socket.on('game:join', _.bind(game.join, this, socket));
      socket.emit('game:player:request', {
        white: !whiteNickname,
        black: !blackNickname
      });      
    }

    this.joinRequestSent = true;
  }, this));
};


/* Spectate a game */

game.spectate = function (socket, data) {
  GameCache.fetch(data.id, _.bind(function (err, model) {
    if (err) return;

    this.gameId = data.id;
    socket.join('game:' + data.id);

    if (!!this.nickname) {
      _.bind(game.sendJoinRequest, this)(socket, data);
    }
  }, this));
};

/* Join game as player */

game.join = function (socket, data) {
  if (!_.contains(['black', 'white'], data.color)) return;

  GameCache.fetch(this.gameId, _.bind(function (err, model) {
    if (err) return;
    if (!!model.get(data.color).get('nickname')) return;

    this.playerColor = data.color;

    model.get(data.color).set('nickname', this.nickname);
    model.save();

    socket.emit('game:joined', {color: data.color});
    socket.on('game:stone:put', _.bind(game.putStone, this, socket));
  }, this));
};

/* Put stone on goban and echo result */

game.putStone = function (socket, data) {
  if (data.stone.color !== this.playerColor) return;

  GameCache.fetch(this.gameId, _.bind(function (err, game) {
    if (err) return;
    if (!game.putStone(data.stone)) return;

    game.save();
    this.io.sockets.in('game:' + this.gameId).emit('game:updated', {
      game: game.serialize()
    });

  }, this));
};