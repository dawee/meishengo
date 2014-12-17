'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var playerStore = require('depot/depot')('mei.player');


var greetings = module.exports = {};


greetings.baptize = function () {
  this.layout.showNicknameForm();
};

greetings.greet = function () {
  var players = playerStore.all();
  var player = !!players ? players[0] : null;

  if (!player || !player.nickname) return greetings.baptize();
};

greetings.plug = function (socket, layout) {
  var ctx = {socket: socket, layout: layout}

  _.bindAll(ctx, 'baptize', 'greet');
  socket.on('greetings:request', greetings.greet);
};