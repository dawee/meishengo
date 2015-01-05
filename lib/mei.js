'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var flatten = require('flat').flatten;


/* Define native types to recognize them in schemas */

var natives = [String, Number, Boolean, Object, Array];

natives.forEach(function (NativeType) {
  NativeType.cast = NativeType;
});

Boolean.cast = function (val) {
  if (_.isString(val)) val = parseInt(val, 10);
  return Boolean(val);
};

/*
 * Mei.Model
 */

var Model = exports.Model = Backbone.Model.extend();
var modelExtend = Model.extend;


/* Intercept Backbone extend to call generateShortcuts routine */

Model.extend = function () {
  var finalModel = modelExtend.apply(this, arguments);
  var modelOverride = function () {
    this.generateShortcuts();

    return finalModel.apply(this, arguments);
  };

  modelOverride.prototype = finalModel.prototype;
  return modelOverride;
};

/* Generate attribute accessors */

Model.prototype.generateShortcuts = function () {
  if ('schema' in this) {
    _.each(this.schema, function (type, attribute) {
      var that = this;

      this[attribute] = function () {
        return that.get(attribute);
      };
    }, this);
  }
};

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
    } else if (_.isBoolean(val)) {
      dump[name] = val ? 1 : 0;
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
  if (_.contains(natives, this.schema[attr])) return this.schema[attr].cast(val);
  if (_.isFunction(this.schema[attr]) && !(val instanceof this.schema[attr])) return new this.schema[attr](val);

  return val; 
};

/* More basic setter using Backbone set(attr, val) */

Model.prototype.setter = function (attr, val) {
  var current = this.get(attr);

  if (!!current && _.isFunction(current.reset) && !_.isFunction(val.reset)) {
    return current.reset(val);
  }

  if (!!current && _.isFunction(current.set) && !_.isFunction(val.set)) {
    return current.set(val);
  }

  return Backbone.Model.prototype.set.apply(this, [attr, this.cast(attr, val)]);
};

/* Override set method to force cast */

Model.prototype.set = function (obj, val) {
  var res;

  if (!this.initialized && !!this.schema) {
    this.initialized = true;

    _.each(this.schema, function (ModelType, name) {
      if (!this.has(name) && !_.contains(natives, ModelType)) {
        this.set(name, new ModelType());
      }
    }, this);
  }

  if (_.isString(obj)) {
    res = this.setter(obj, val);
    this.trigger('change');
  } else {
    res = _.every(obj, function (val, attr) {
      return this.setter(attr, val);
    }, this);

    this.trigger('change');
  }

  return res;
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

Collection.prototype.merge = function (other) {
  other.each(this.add, this);
};


/*
 * Mei.View
 */

var View = exports.View = Backbone.View.extend();


/* Echo event with same or different name */

View.prototype.echo = function (emitter, origin, destination, recipient) {
  emitter = emitter || this;
  recipient = recipient || this;

  emitter.on(origin, function (data) {
    recipient.emit(destination || origin, data);
  });
};

/* Alias for plugs (same behavior as socket) */

View.prototype.emit = View.prototype.trigger;

/* Extend delegateEvents to bind Backbone.Event types */

View.prototype.delegateEvents = function () {
  var bindList = [];

  _.each(this.events, function (callbackName, eventName) {
    if (!!eventName.match(/^[\w:]+$/)) {
      this.off(eventName);
      this.on(eventName, this[callbackName]);
    }

    if (!_.contains(bindList, callbackName) && _.isFunction(this[callbackName])) {
      bindList.push(callbackName);
    } 
  }, this);


  if (bindList.length > 0) _.bindAll.apply(_, [this].concat(bindList));

  Backbone.View.prototype.delegateEvents.apply(this);
};