/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var flatten = require('flat').flatten


/*
 * Define native types to recognize them in schemas
 */

var natives = [
  String,
  Number,
  Boolean,
  Object,
  Array
];

/*
 * Mei.Model
 */

var Model = exports.Model = Backbone.Model.extend();


/* Recursive serializer of model attributes */

Model.prototype.serialize = function () {
  var dump = {};
  var attributes = this.attributes;

  if (!!this.schema) attributes = _.pick(attributes, _.keys(this.schema));

  _.each(attributes, function (val, name) {
    if (_.isFunction(val.serialize)) {
      dump[name] = val.serialize();
    } else if (_.isFunction(val.toJSON)) {
      dump[name] = val.toJSON();
    } else {
      dump[name] = _.clone(val);
    }
  });

  return dump;
};

/* Return a flat JSON representation */

Model.prototype.flatten = function () {
  return flatten(this.serialize());
};

/* Cast every attributes from schema */

Model.prototype.cast = function (attr, val) {
  if (!_.isObject(this.schema)) return val;
  if (!_.has(this.schema, attr)) return val;
  if (_.contains(natives, this.schema[attr])) return this.schema[attr](val);
  if (_.isFunction(this.schema[attr]) && !(val instanceof this.schema[attr])) return new this.schema[attr](val);

  return val; 
};

/* Override set method to force cast */

Model.prototype.set = function (obj, val) {
  if (_.isString(obj)) {
    return Backbone.Model.prototype.set.apply(this, [obj, this.cast(obj, val)]);   
  } else {
    return _.every(obj, function (val, attr) {
      return Backbone.Model.prototype.set.apply(this, [attr, this.cast(attr, val)]);
    }, this);
  }
};

/*
 * Mei.Collection
 */

var Collection = exports.Collection = Backbone.Collection.extend();


/* Recursive serializer for collection models */

Collection.prototype.serialize = function () {
  var dump = [];

  this.each(function (model) {

    if (_.isFunction(model.serialize)) {
      dump.push(model.serialize());
    } else {
      dump.push(_.clone(model));
    }
  });

  return dump;
};  
