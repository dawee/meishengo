'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var async = require('async');
var redis = require('redis');
var redisSync = require('../sync/redis');
var Game = require('../model/game');


/* Exports GameCache */

var GameCache = module.exports = {};

function checkPlayerPresence(game, color, callback) {
  var client = redis.createClient();
  var nickname = game.get(color).get('nickname');

  if (!nickname) {
    callback();
  } else {
    client.get('nickname:' + nickname, function (err, res) {
      if (!res) game.get(color).set('nickname', '');

      callback();
    });
  }
}

/* Check if player nicknames are still registered */

function checkPlayersPresence(game, callback) {
  async.series([
    _.partial(checkPlayerPresence, game, 'black'),
    _.partial(checkPlayerPresence, game, 'white')
  ], function () {
    game.save(null, {
      success: _.partial(callback, null, game),
      error: _.partial(callback, true, null)
    });
  });
};

/* Create a game model with Redis sync */

GameCache.create = function (opts) {
  var game = new Game(opts);
  game.sync = redisSync;

  return game;
};

/* Retreive game from redis */

GameCache.fetch = function (id, callback) {
  var game = this.create({id: id});

  game.fetch({
    success: function () {
      checkPlayersPresence(game, callback);
    },
    error: function (err) {
      callback(err || true, null);
    }
  });
};

/* Save game on Redis if not exists */

GameCache.createIfNotExists = function (opts, callback) {
  GameCache.fetch(opts.id, function (err, model) {
    if (!!model) return callback(new Error('Game exists'));

    var game = GameCache.create(opts);
    game.save(null, {
      success: function () {
        callback(null, game);
      },
      error: function (err) {
        callback(err, null);
      }
    });
  });
};
