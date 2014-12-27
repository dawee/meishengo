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
Message.prototype.events = {
  'mousedown .pointer': 'pointIntersection'
}

/* Read player from store */

Message.prototype.initialize = function (data) {
  this.data = data; 

  if (!!this.data.nickname) {
    this.data.nickname = '<' + this.data.nickname + '>';
  }
};

/* Trigger event when mouse enter a span.pointer element */

Message.prototype.pointIntersection = function (evt) {
  var row = parseInt(evt.currentTarget.getAttribute('data-row'), 10) - 1;
  var col = parseInt(evt.currentTarget.getAttribute('data-col'), 10) - 1;

  this.trigger('intersection:point', {row: row, col: col});
};

/* Format message line, parsing patterns */

Message.prototype.format = function (line) {
  return line
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /\[([0-9]{1,2});([0-9]{1,2})\]/g,
      '<span class="pointer" data-row="$1" data-col="$2">[$1;$2]</span>'
    )
    .replace(
      /(https?:\/\/?([\/\w \.-]*)*\/?)/g,
      '<a href="$1">$1</a>'
    );
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
