'use strict';

/*
 * Module dependencies
 */

var backbonify = require('../model/mei').backbonify;
var redisSync = require('../sync/redis');
var Game = require('../model/game');


/* Exports GameStore */

var GameStore = module.exports = {};


/* Create a game model with Redis sync */

GameStore.create = function (opts) {
  var game = new Game(opts);
  game.sync = redisSync;

  return game;
};

/* Retreive game from redis */

GameStore.fetch = function (id, callback) {
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

GameStore.createIfNotExists = function (opts, callback) {
  GameStore.fetch(opts.id, function (err, model) {
    if (!!model) return callback(new Error('Game exists'));

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
