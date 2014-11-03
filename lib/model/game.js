'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var Mei = require('./mei');
var Goban = require('./goban');
var Player = require('./player');
var Stone = require('./stone');


/*
 * Game model
 *
 * @key {Model:Goban} goban
 * @key {string} turn (black/white)
 */

var Game = module.exports = Mei.Model.extend({
  defaults: {
    type: 'game',
    turn: 'black',
    white: new Player(),
    black: new Player()
  },
  schema: {
    id: String,
    type: String,
    turn: String,
    goban: Goban,
    black: Player,
    white: Player
  }
});

/* Switch between the 2 possible values : black & white */

Game.prototype.toggleTurn = function () {
  this.set('turn', this.get('turn') === 'black' ? 'white' : 'black');
};

/* Shortcut to the goban */

Game.prototype.gbn = function () {
  return this.get('goban');
};

/* Put a stone on goban, if possible */

Game.prototype.putStone = function (stone) {
  var that = this;

  if (!this.gbn()) return false;

  this.gbn().off('capture');
  this.gbn().on('capture', function (group) {
    that.get(stone.get('color')).incPrisoners(group.get('stones').size());
  });

  if (!(stone instanceof Stone)) stone = new Stone(stone);
  if (stone.get('color') !== this.get('turn')) return false;
  if (!this.gbn().putStone(stone, this.countPrisoners)) return false;

  this.toggleTurn();
  return true;
};