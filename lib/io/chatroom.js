'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var conf = require('../conf');
var fs = require('fs');
var mustache = require('mustache');


var chatroom = module.exports = {};
var gameHost = 'http://' + conf.get('host');
var welcomeTemplate = fs.readFileSync(
  __dirname + '/../asset/welcome.md',
  'utf8'
);


/* Chatroom welcomer */

chatroom.welcome = function (socket, data) {
  socket.emit('chat:message:system', {
    content: mustache.render(welcomeTemplate,{
      nickname: this.nickname,
      gameLink: gameHost + '/game/' + this.gameId
    }
  )})
};