/*
 * Module dependencies
 */

var _ = require('underscore');
var async = require('async');
var assert = require('assert');
var redis = require("redis");

/*
 * Register sync methods
 */

var sync = module.exports = function (method, model, opts) {    
  if (method === 'create' || method === 'update') sync.save(model, opts);
};

/* Check if model has an id */

sync.checkId = function (data, done) {
  done(!data.id? 'Model has no id' : null);
};

/* Check if model has a type */

sync.checkType = function (data, done) {
  done(!data.id? 'Model has no type' : null);
};

/* Save all data keys on Redis */

sync.saveKeys = function (data, done) {
  var client = redis.createClient();

  async.each(
    _.keys(data),
    function saveKey(key, nextKey) {
      var hashKey = data.type + ':' + data.id; 
      client.hset(hashKey, key, data[key], nextKey);
    },
    function endClient(err) {
      client.end();
      done(err);
    }
  );
};

/* Forward error or success when process end */

sync.end = function (opts, err) {
  if (err) {
    opts.error(new Error(err));
  } else {
    opts.success();
  }
};

/* Save model */

sync.save = function (model, opts) {
  var data = model.flatten();

  async.series([
    _.bind(sync.checkId, sync, data),
    _.bind(sync.checkType, sync, data),
    _.bind(sync.saveKeys, sync, data),
  ], _.bind(sync.end, sync, opts));
};