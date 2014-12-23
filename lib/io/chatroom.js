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
  __dirname + '/../asset/welcome.mus',
  'utf8'
);


/* Chatroom welcomer */

chatroom.welcome = function (socket, data) {
  socket.on('chat:message', _.bind(chatroom.echo, this, socket));

  socket.emit('chat:message:system', {
    content: mustache.render(welcomeTemplate,{
      nickname: this.nickname,
      gameLink: gameHost + '/game/' + this.gameId
    }
  )});
};

/* Echo chat message in the game room */

chatroom.echo = function (socket, data) {
  this.io.sockets
    .in('game:' + this.gameId)
    .emit('chat:message:player', {
      nickname: this.nickname,
      content: data.content
    });  
};