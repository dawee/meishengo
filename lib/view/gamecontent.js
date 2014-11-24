'use strict';

/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');
var Mei = require('./mei');
var Goban = require('../model/goban');
var GobanView = require('./goban');
var Stone = require('../model/stone');


/*
 * GameContent
 */

var GameContent = module.exports = Mei.View.extend();

GameContent.prototype.className = 'mei-content-game';


/* Append the goban */

GameContent.prototype.initialize = function (opts) {
  _.bindAll(this, 'putStone', 'previewStone', 'resize');
  this.model = opts.model;
  this.model.on('change:playerColor', this.resize);
  this.gobanView = new GobanView({model: this.model.gbn()});
  this.gobanView.on('intersection:click', this.putStone);
  this.gobanView.on('intersection:hover', this.previewStone);
  this.$el.append(this.gobanView.render().el);
};

GameContent.prototype.previewStone = function (opts) {
  if (!!this.lastPreview) {
    this.gobanView.removeStonePreview(this.lastPreview);
    this.lastPreview = null;
  }

  if (!this.model.has('playerColor')) return;

  var stone = new Stone(_.extend(opts, {color: this.model.get('playerColor')}));

  if (this.model.canPutStone(stone)) {
    this.gobanView.previewStone(stone);
    this.lastPreview = stone;
  }
};


/* Put a stone on goban */

GameContent.prototype.putStone = function (opts) {
  if (!this.model.has('playerColor')) return;

  var stone = {
    row: opts.row,
    col: opts.col,
    color: this.model.get('playerColor')
  };

  if (this.model.putStone(stone)) this.trigger('stone:put', {stone: stone});
};

/* Setup goban geometry from current content size */

GameContent.prototype.resize = function () {
  var playerColor = 'black';
  var opponentColor = 'white';
  var contentHeight = this.$el.height();
  var dim = contentHeight * 0.95;
  var margin = (contentHeight - dim) / 2;

  if (this.model.get('playerColor') === 'white') {
    playerColor = 'white';
    opponentColor = 'black';
  }

  this.gobanView.resize({top: margin, left: margin, width: dim, height: dim});
};
