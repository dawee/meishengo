'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
var _  = require('underscore');
var Backbone = require('backbone');
var Mei = require('./mei');
var GobanChoiceView = require('./gobanchoice');
var Spinner = require('spin.js');


/*
 * CreationBoardView
 */

var CreationBoardView = module.exports = Mei.View.extend();

CreationBoardView.prototype.className = 'mei-board-creation';

/* Bind submit event */

CreationBoardView.prototype.events = {
  'click button': 'submit'
};

/* Initialize template and form model */

CreationBoardView.prototype.initialize = function (opts) {
  _.bindAll(this, 'remove', 'submit');
  this.model = new Backbone.Model({id: opts.id, size: 19, color: 'black'});
  this.$button = $('<button>').html('Create');
  this.$el
    .append($('<h2>').html('New Game'))
    .append(new GobanChoiceView({model: this.model}).render().el)
    .append(this.$button);
};

/* Close creation board */

CreationBoardView.prototype.close = function () {
  this.el.classList.add('closed');
};

/* Submit creation form */

CreationBoardView.prototype.submit = function () {
  var spinner = new Spinner({
    color: this.$button.css('color'),
    lines: 12,
    width: 2
  });

  this.$button.html('');
  spinner.spin(this.$button[0]);
  this.trigger('submit');
};