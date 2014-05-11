var Backbone = require('backbone');
var GobanChoiceView = require('./gobanchoice')

var CreationBoardView = module.exports = Backbone.View.extend();

CreationBoardView.prototype.tagName = 'mei-board-creation';

CreationBoardView.prototype.initialize = function (opts) {
  this.model = new Backbone.Model({size: 19});

  this.$el
    .append($('<h2>').text('New Game'))
    .append(new GobanChoiceView({model: this.model}).render().el)
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