'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var conf = require('../conf');
var fs = require('fs');
var mustache = require('mustache');
var GameCache = require('../cache/game');
var Player = require('../model/player');


/* Game callback : listen to game elements */

var game = module.exports = {};
var gameHost = 'http://' + conf.get('host');
var welcomeTemplate = fs.readFileSync(
  __dirname + '/../asset/welcome.md',
  'utf8'
);


/* Spectate a game */

game.spectate = function (socket, data) {
  GameCache.fetch(data.id, _.bind(function (err, model) {
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

  GameCache.fetch(this.gameId, _.bind(function (err, model) {
    if (err) return;

    var isBlackPresent = !!model.get('black').get('present');
    var isWhitePresent = !!model.get('white').get('present');

    socket.emit('game:chat:welcome');
    socket.emit('game:chat:system', {
      content: mustache.render(welcomeTemplate, {
        nickname: data.nickname,
        gameLink: gameHost + '/game/' + this.gameId
      })
    });

    socket.on('game:chat:message:request', _.bind(game.echo, this, socket));
    this.io.sockets.in('game:' + this.gameId).emit('game:spectator:joined', {
      nickname: data.nickname
    });

    if (!isWhitePresent || !isBlackPresent) {
      socket.on('game:join', _.bind(game.join, this, socket));
      socket.emit('game:player:request', {
        white: !isWhitePresent,
        black: !isBlackPresent
      });      
    }
  }, this));
};

game.echo = function (socket, data) {
  GameCache.fetch(this.gameId, _.bind(function (err, model) {
    this.io.sockets.in('game:' + this.gameId).emit('game:chat:message', {
      message: data.message
    });
  }, this));  
};

/* Join game as player */

game.join = function (socket, data) {
  if (!_.contains(['black', 'white'], data.color)) return;

  GameCache.fetch(this.gameId, _.bind(function (err, model) {
    if (err) return;
    if (!!model.get(data.color).get('present')) return;

    this.playerColor = data.color;

    model.get(data.color).set('present', true);
    model.save();

    socket.emit('game:joined', {color: data.color});
    socket.on('game:stone:put', _.bind(game.putStone, this, socket));
    socket.on('disconnect', _.bind(game.leave, this, socket));
  }, this));
};

/* Leave game (player or observer) */

game.leave = function(socket, data) {
  GameCache.fetch(this.gameId, _.bind(function (err, model) {
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

  GameCache.fetch(this.gameId, _.bind(function (err, game) {
    if (err) return;
    if (!game.putStone(data.stone)) return;

    game.save();
    this.io.sockets.in('game:' + this.gameId).emit('game:updated', {
      game: game.serialize()
    });

  }, this));
};