'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var async = require('async');
var assert = require('assert');
var conf = require('../conf');
var redis = require("redis");
var unflatten = require('flat').unflatten;

/*
 * Register sync methods
 */

var sync = module.exports = function (method, model, opts) {    
  if (!_.has(sync, method)) return false;

  sync[method]({
    model: model,
    opts: opts,
    data: model.flatten(),
    client: redis.createClient()
  });

};

/* Reset TTL */

sync.expandLife = function (bundle, done) {
  var hashKey = bundle.data.type + ':' + bundle.data.id; 

  bundle.client.expire(hashKey, conf.get('ttl'), done);
};

/* Check if model has an id */

sync.checkId = function (bundle, done) {
  done(!bundle.data.id? 'Model has no id' : null);
};

/* Check if model has a type */

sync.checkType = function (bundle, done) {
  done(!bundle.data.id? 'Model has no type' : null);
};

/* Save all data keys on Redis */

sync.saveKeys = function (bundle, done) {
  async.each(_.keys(bundle.data), function saveKey(key, nextKey) {
    var hashKey = bundle.data.type + ':' + bundle.data.id; 
    bundle.client.hset(hashKey, key, bundle.data[key], nextKey);
  }, done);
};

/* Forward error or success when process end */

sync.end = function (bundle, err) {
  bundle.client.end();
 
  if (err) {
    bundle.opts.error(new Error(err));
  } else {
    bundle.opts.success(bundle.res);
  }
};

/* Delete model hash key from Redis */

sync.delHashKey = function (bundle, done) {
  var hashKey = bundle.data.type + ':' + bundle.data.id; 

  bundle.client.del(hashKey, done);
};

/* Read hash keys from Redis */

sync.readHash = function (bundle, done) {
  var hashKey = bundle.data.type + ':' + bundle.data.id; 

  bundle.client.hgetall(hashKey, function (err, flat) {
    if (!!flat) bundle.res = unflatten(flat);
    if (!flat || !_.isObject(flat) || _.size(flat) === 0) err = 'Not found';

    done(err);
  });
};

/* Read model from Redis */

sync.read = function (bundle) {
  async.series([
    _.bind(sync.checkId, this, bundle),
    _.bind(sync.checkType, this, bundle),
    _.bind(sync.readHash, this, bundle),
  ], _.bind(sync.end, this, bundle));
};

/* Save model on Redis */

sync.create = function (bundle) {
  async.series([
    _.bind(sync.checkId, this, bundle),
    _.bind(sync.checkType, this, bundle),
    _.bind(sync.saveKeys, this, bundle),
    _.bind(sync.expandLife, this, bundle),
  ], _.bind(sync.end, this, bundle));
};

sync.update = sync.create;

/* Delete model from Redis */

sync.delete = function (bundle) {
  async.series([
    _.bind(sync.checkId, this, bundle),
    _.bind(sync.checkType, this, bundle),
    _.bind(sync.delHashKey, this, bundle),
  ], _.bind(sync.end, this, bundle));
};
