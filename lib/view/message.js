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

  if (!!this.data.login) {
    this.data.login = '<' + this.data.login + '>';
  }
};

/* Load Message template */

Message.prototype.render = function () {
  if (!!this.data.type) this.el.classList.add(this.data.type);  

  this.$el.append(template(this.data));
  return this;
};
