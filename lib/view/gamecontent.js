/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');
var Backbone = require('backbone');
var Goban = require('../model/goban');
var GobanView = require('./goban');
var StoneRack = require('./stonerack');


/*
 * GameContentView
 */

var GameContentView = module.exports = Backbone.View.extend();

GameContentView.prototype.tagName = 'mei-content-game';


/* Append the goban */

GameContentView.prototype.initialize = function (opts) {
  _.bindAll(this, 
    'resize',
    'putStone',
    'gameUpdated',
    'gameJoined'
  );
  this.model = opts.model;
  this.socket = opts.socket;
  this.socket.on('game:joined', this.gameJoined);
  this.socket.emit('game:observe', {id: this.model.get('id')});
  this.socket.on('game:updated', this.gameUpdated);
  this.gobanView = new GobanView({model: this.model.gbn()});
  this.gobanView.on('click', this.putStone);
  this.racks = {
    black: new StoneRack({color: 'black', game: this.model}),
    white: new StoneRack({color: 'white', game: this.model})
  };
  this.$el.append(this.racks.black.render().el);
  this.$el.append(this.gobanView.render().el);
  this.$el.append(this.racks.white.render().el);
};

/* Put a stone on goban */

GameContentView.prototype.putStone = function (opts) {
  if (!this.model.has('playerColor')) return;

  var stone = {
    row: opts.row,
    col: opts.col,
    color: this.model.get('playerColor')
  };

  if (this.model.putStone(stone)) this.socket.emit('stone:put', {stone: stone});
};

GameContentView.prototype.gameUpdated = function (data) {
  this.model.set(data.game);
};

GameContentView.prototype.gameJoined = function (data) {
  this.model.set('playerColor', data.color);
  this.resize();
};

/* Setup goban geometry from current content size */

GameContentView.prototype.resize = function () {
  var playerColor = 'black';
  var opponentColor = 'white';
  var contentHeight = this.$el.height();
  var dim = contentHeight * 0.85;
  var margin = (contentHeight - dim) / 2;

  if (this.model.get('playerColor') === 'white') {
    playerColor = 'white';
    opponentColor = 'black';
  }

  this.gobanView.resize({top: margin, left: margin, width: dim, height: dim});
  this.racks[opponentColor].resize({top: 3, bottom: null, left: margin, width: dim, height: margin - 3});
  this.racks[playerColor].resize({top: null, bottom: 3, left: margin, width: dim, height: margin - 3});
};
