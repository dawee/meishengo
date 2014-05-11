var Backbone = require('backbone');
var Goban = require('../model/goban');
var GobanView = require('./goban');

var CreationBoardView = module.exports = Backbone.View.extend();

CreationBoardView.prototype.tagName = 'mei-board-creation';

CreationBoardView.prototype.initialize = function (opts) {
  this.$el
    .append($('<h2>').text('New Game'))
    .append(
      $('<mei-goban-choice>')
        .append(new GobanView({model: new Goban({size: 19})}).el)
        .append(new GobanView({model: new Goban({size: 13})}).el)
        .append(new GobanView({model: new Goban({size: 9})}).el)
    )
    .append($('<h3>').text('Join as'))
    .append(
      $('<mei-stone-choice>')
        .append(
          $('<mei-stone>')
            .addClass('black')
            .append($('<span>').addClass('shadow'))
            .append($('<span>').addClass('light'))
        )
        .append(
          $('<mei-stone>')
            .addClass('white')
            .append($('<span>').addClass('shadow'))
            .append($('<span>').addClass('light'))
        )
    )
    .append($('<button>').text('Create'));
};