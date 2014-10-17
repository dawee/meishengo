'use strict';

/*
 * Module dependencies
 */

var Game = require('../model/game');
var redisSync = require('../sync/redis');


/* Exports GameStore */

var GameStore = module.exports = {};


/* Create a game model with Redis sync */

GameStore.create = function (opts) {
  var game = new Game(opts);
  game.sync = redisSync;

  return game;
};

/* Checks if game exists on redis */

GameStore.exists = function (id, callback) {
  var game = this.create({id: id});

  game.fetch({
    success: function () {
      callback(null, true);
    },
    error: function (err) {
      callback(err, false);
    }
  });
};

/* Checks if game exists on redis */

GameStore.fetch = function (id, callback) {
  var game = this.create({id: id});

  game.fetch({
    success: function () {
      callback(null, game);
    },
    error: function (err) {
      callback(err, null);
    }
  });
};

/* Save game on Redis if not exists */

GameStore.createIfNotExists = function (opts, callback) {
  GameStore.exists(opts.id, function (err, exists) {
    if (exists) return callback(new Error('Game exists'));

    var game = GameStore.create(opts);
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
