'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
var _ = require('underscore');
var template = require('../template/message.jade');
var Mei = require('./mei');


/*
 * Exports Message
 */

var Message = module.exports = Mei.View.extend();

Message.prototype.className = 'message';


/* Read player from store */

Message.prototype.initialize = function (data) {
  this.data = data; 
};

/* Load Message template */

Message.prototype.render = function () {
  this.$el.append(template(this.data));
  return this;
};
