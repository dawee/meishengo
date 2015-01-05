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
var GameCache = require('../cache/game');


var USAGE_MAX_COL = 3;
var USAGE_COL_WIDTH = 10;

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

commands.help = function (socket, data) {
  var usage = 'List of avalaible commands:\n\n';
  var line = '';
  var colSlot = 0;
  var commandName = '';
  var commandsNames = Object.keys(commands).sort();
  var maxCol = USAGE_MAX_COL;
  var maxRow = Math.ceil(commandsNames.length / maxCol);
  var col = 0;
  var row = 0;

  for (row = 0; row < maxRow; row++) {
    usage += row === 0 ? '' : '\n';
    line = '';
    
    for (col = 0; col < maxCol; col++) {
      commandName = commandsNames[row * USAGE_MAX_COL + col] || '';
      colSlot = USAGE_COL_WIDTH * col;
      line += _.range(colSlot - line.length).map(function () {
        return ' ';
      }).join('') + commandName.toUpperCase();
    }

    usage += line;
  }

  socket.emit('chat:message:system', {content: usage});
};


/* Chatroom welcomer */

chatroom.welcome = function (socket, data) {
  socket.on('chat:message', _.bind(chatroom.echo, this, socket));

  socket.emit('chat:message:system', {
    content: mustache.render(welcomeTemplate, {
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

  GameCache.fetch(this.gameId, _.bind(function (err, model) {
    if (err) return;

    model.room().putMessage(this.nickname, data.content);
    model.save();


    this.io.sockets
      .in('game:' + this.gameId)
      .emit('chat:message:player', {
        nickname: this.nickname,
        content: data.content
      });
  }, this));
};