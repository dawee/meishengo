'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
var _ = require('underscore');
var template = require('../template/message.jade');
var Mei = require('../mei');


/*
 * Exports Message
 */

var Message = module.exports = Mei.View.extend();

Message.prototype.className = 'message';


/* Read player from store */

Message.prototype.initialize = function (data) {
  this.data = data; 

  if (!!this.data.nickname) {
    this.data.nickname = '<' + this.data.nickname + '>';
  }
};

/* Format message line, parsing patterns */

Message.prototype.format = function (line) {
  return line;
};

/* Load Message template */

Message.prototype.render = function () {
  if (!!this.data.type) this.el.classList.add(this.data.type);  

  this.$el.append(template(this.data));

  _.each(this.data.content.split('\n'), function (line) {
    $('.content', this.$el).append($('<p></p>').html(this.format(line)));
  }, this);
 
  return this;
};
