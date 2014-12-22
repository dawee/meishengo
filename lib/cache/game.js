'use strict';

/*
 * Module dependencies
 */

var redisSync = require('../sync/redis');
var Game = require('../model/game');


/* Exports GameCache */

var GameCache = module.exports = {};


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
      callback(null, game);
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
