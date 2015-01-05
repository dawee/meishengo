'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var chatroom = require('./chatroom');
var playerIO = require('./player');
var conf = require('../conf');
var GameCache = require('../cache/game');
var Player = require('../model/player');
var Stone = require('../model/stone');


/* Game callback : listen to game elements */

var game = module.exports = {};


game.sendJoinRequest = function (socket, data) {
  if (this.joinRequestSent || !this.gameId || !this.nickname) return;

  _.bind(chatroom.welcome, this)(socket, data);
  GameCache.fetch(this.gameId, _.bind(function (err, model) {
    if (err) return;

    var blackNickname = model.get('black').get('nickname');
    var whiteNickname = model.get('white').get('nickname');

    if (blackNickname === this.nickname) {
      // Auto join black
      this.playerColor = 'black';
      socket.emit('game:joined', {color: 'black'});
      socket.on('game:stone:put', _.bind(playerIO.putStone, this, socket));
    } else if (whiteNickname === this.nickname) {
      // Auto join white
      this.playerColor = 'white';
      socket.emit('game:joined', {color: 'white'});
      socket.on('game:stone:put', _.bind(playerIO.putStone, this, socket));
    } else if (!whiteNickname || !blackNickname) {
      socket.on('game:join', _.bind(game.join, this, socket));
      socket.emit('game:player:request', {
        white: !whiteNickname,
        black: !blackNickname
      });
    }

    if (blackNickname !== this.nickname && !whiteNickname !== this.nickname) {
      this.io.sockets.in('game:' + this.gameId).emit('chat:message:system', {
        content: this.nickname + ' joined the room'
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

    // show last saved messages of game room
    _.each(model.room().history().toJSON(), function (message) {
      socket.emit('chat:message:player', message);
    });

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
    socket.on('game:stone:put', _.bind(playerIO.putStone, this, socket));
    socket.on('game:pass', _.bind(playerIO.pass, this, socket));
  }, this));
};
