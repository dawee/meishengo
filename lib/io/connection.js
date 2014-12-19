'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var game = require('./game');
var hat = require('hat');
var redis = require('redis');
var GameCache = require('../cache/game');

var ID_PATTERN = /^[\w\-]{3,16}$/;

/* Connection callback : listen to root elements */

var connection = module.exports = function (socket) {
  socket.on('game:spectate', _.bind(game.spectate, this, socket));
  socket.on('game:create', _.bind(connection.createGame, this, socket));
  socket.on('register', _.bind(connection.register, this, socket));
};

/* Generate the model data from event data */

connection.parseGameData = function (data) {
  data = _.extend({size: 19, color: 'black'}, data);

  return {
    id: data.id,
     goban: {
      size: data.size,
    }
  };
};

/* Create the game on redis */

connection.createGame = function (socket, data) {
  if (!data.id || !_.isString(data.id) || !data.id.match(ID_PATTERN)) {
    return;
  }

  GameCache.createIfNotExists(connection.parseGameData(data), _.bind(function (err, model) {
    if (err) return;

    socket.emit('game:created', {game: model.serialize()});
  }, this));
};

/* Register a new nickname on cache */

connection.register = function (socket, data) {
  var client = redis.createClient();
  var token = hat();

  client.setnx('nickname:' + data.nickname, token, function (err, res) {
    if (res === 1) {
      socket.emit('register:succeed', {
        nickname: data.nickname,
        token: token 
      });
    }
  });
};