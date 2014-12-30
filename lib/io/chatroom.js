'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var conf = require('../conf');
var fs = require('fs');
var mustache = require('mustache');
var playerIO = require('./player');
var shellwords = require('shellwords');


var chatroom = module.exports = {};
var commands = {};
var gameHost = 'http://' + conf.get('host');
var welcomeTemplate = fs.readFileSync(
  __dirname + '/../asset/welcome.mus',
  'utf8'
);

commands.pass = function (socket, data) {
  playerIO.pass.call(this, socket, data);
};


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

/* Parse command */

chatroom.parseCommand = function (socket, data) {
  var command = data.match[1].toLowerCase();
  var argsLine = data.match[2] || '';

  if (! _.has(commands, command)) {
    socket.emit('chat:message:system', {
      content: command.toUpperCase() + ' Unknown command'
    });
  } else {
    data.argv = shellwords.split(argsLine);
    commands[command].call(this, socket, data);
  }
};

/* Echo chat message in the game room */

chatroom.echo = function (socket, data) {
  data.match = data.content.match(/^\/([a-zA-Z]+) ?(.*)/);

  if (!!data.match) return chatroom.parseCommand.call(this, socket, data);

  this.io.sockets
    .in('game:' + this.gameId)
    .emit('chat:message:player', {
      nickname: this.nickname,
      content: data.content
    });  
};