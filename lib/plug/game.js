'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var $ = require('zepto').$;
var localforage = require('localforage');


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

  localforage.getItem('nickname', _.bind(function (err, val) {
    if (!!val) return send({nickname: val});
    
    this.layout.showNicknameForm();
    this.layout.once('form:nickname:submit', _.bind(function (evt) {
      localforage.setItem('nickname', evt.nickname);
      send({nickname: evt.nickname});
    }, this));
  }, this));
};

/* Start conversation with existing game */

game.connect = function (socket, layout) {
  var ctx = {
    socket: socket,
    layout: layout
  };

  socket.on('game:player:request', _.bind(game.join, ctx));
  socket.on('game:greetings:request', _.bind(game.greet, ctx));
  socket.emit('game:spectate', layout.model.toJSON());
};

/* Wait for creation board submit event to create new game */

game.create = function (socket, creationBoard, layout) {
  socket.once('game:created', function (data) {
    creationBoard.close();
    layout.model.set(data.game);
    layout.openToContent();
    _.delay(_.partial(game.connect, socket, layout), 2000);
  });

  creationBoard.on('submit', function (data) {
    socket.emit('game:create', creationBoard.model.toJSON());
  });
};

