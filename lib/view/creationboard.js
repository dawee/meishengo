'use strict';

/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _  = require('underscore');
var Backbone = require('backbone');
var GobanChoiceView = require('./gobanchoice');
var ColorChoiceView = require('./colorchoice');
var Spinner = require('spin.js');


/*
 * CreationBoardView
 */

var CreationBoardView = module.exports = Backbone.View.extend();

CreationBoardView.prototype.className = 'mei-board-creation';

/* Bind submit event */

CreationBoardView.prototype.events = {
  'click button': 'submit'
};

/* Initialize template and form model */

CreationBoardView.prototype.initialize = function (opts) {
  _.bindAll(this, 'submit');
  this.model = new Backbone.Model({id: opts.id, size: 19, color: 'black'});
  this.socket = opts.socket;
  this.$button = $('<button>').text('Create');
  this.$el
    .append($('<h2>').text('New Game'))
    .append(new GobanChoiceView({model: this.model}).render().el)
    .append($('<h3>').text('Join as'))
    .append(new ColorChoiceView({model: this.model}).render().el)
    .append(this.$button);
};

/* Submit creation form */

CreationBoardView.prototype.submit = function () {
  var $overlay = $('<div>').addClass('mei-overlay').insertBefore(this.$button);
  var spinner = new Spinner({
    color: this.$button.css('color'),
    lines: 12,
    width: 2
  });

  this.$button.text('');
  spinner.spin(this.$button[0]);
  this.socket.emit('game:create', this.model.toJSON());

  _.defer(function () {
    $overlay.css('opacity', 0.5);
  });
};