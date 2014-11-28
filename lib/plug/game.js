'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var $ = require('jbone');
var playerStore = require('depot/depot')('mei.player');


var game = module.exports = {};

game.play = function (data) {
  this.layout.model.set('playerColor', data.color);
  this.layout.on('stone:put', _.bind(function (evt) {
    this.socket.emit('game:stone:put', evt);
  }, this));
};

game.join = function (data) {
  this.layout.showJoinForm(data);

  this.socket.on('game:joined', _.bind(game.play, this));

  this.layout.on('form:join', _.bind(function (evt) {
    if (! _.contains(['black', 'white'], evt.choice)) return;

    this.socket.emit('game:join', {color: evt.choice});
  }, this));
};

game.greet = function () {
  var send = _.bind(function send(data) {
    this.socket.emit('game:greetings', {nickname: data.nickname});
  }, this);

  var players = playerStore.all();
  var player = !!players ? players[0] : null;

  if (!!player) return send({nickname: player.nickname});
    
  this.layout.showNicknameForm();
  this.layout.once('form:nickname:submit', _.bind(function (evt) {
    playerStore.save({nickname: evt.nickname});
    send({nickname: evt.nickname});
  }, this));
};

game.chat = function () {
  this.layout.openChat();
};

game.spectate = function () {
  this.socket.on('game:player:request', _.bind(game.join, this));
  this.socket.on('game:greetings:request', _.bind(game.greet, this));
  this.socket.on('game:chat:welcome', _.bind(game.chat, this));

  this.socket.emit('game:spectate', this.layout.model.toJSON());
  this.socket.on('game:updated', _.bind(function (evt) {
    this.layout.model.set(evt.game);
  }, this));
};

/* Start conversation with existing game */

game.connect = function (socket, layout) {
  _.bind(game.spectate, {
    socket: socket,
    layout: layout
  })();
};

/* Wait for creation board submit event to create new game */

game.create = function (socket, creationBoard, layout) {
  socket.once('game:created', function (data) {
    creationBoard.close(function () {
      creationBoard.remove();
      layout.model.set(data.game);
      layout.openToContent();
      _.delay(_.partial(game.connect, socket, layout), 2000);
    });
  });

  creationBoard.on('submit', function (data) {
    socket.emit('game:create', creationBoard.model.toJSON());
  });
};

