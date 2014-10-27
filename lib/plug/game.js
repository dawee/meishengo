'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var $ = require('zepto').$;
var localforage = require('localforage');


var game = module.exports = {};

game.greetings = function (data) {
  this.socket.emit('game:greetings', {nickname: data.nickname});
};

game.checkNickname = function () {
  localforage.getItem('nickname', _.bind(function (err, val) {
    if (!!val) return _.bind(game.greetings, this)({nickname: val});
    
    this.layout.showNicknameForm();
    this.layout.once('form:nickname:submit', _.bind(function (data) {
      localforage.setItem('nickname', data.nickname);
      _.bind(game.greetings, this)({nickname: val});
    }, this));
  }, this));
};

/* Start conversation with existing game */

game.connect = function (socket, layout) {
  var ctx = {
    socket: socket,
    layout: layout
  };

  socket.on('game:greetings:request', _.bind(game.checkNickname, ctx));
  socket.emit('game:observe', layout.model.toJSON());
};

/* Wait for creation board submit event to create new game */

game.listenGameCreation = function (socket, creationBoard, layout) {
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

