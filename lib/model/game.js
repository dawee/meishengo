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

Game.prototype.initialize = function () {
  _.bindAll(this, 'countPrisoners');
};


/* Switch between the 2 possible values : black & white */

Game.prototype.toggleTurn = function () {
  this.set('turn', this.get('turn') === 'black' ? 'white' : 'black');
};

/* Shortcut to the goban */

Game.prototype.gbn = function () {
  return this.get('goban');
};

/* Checks if transaction has dead groups and count  */

Game.prototype.countPrisoners = function (transaction) {
  transaction.get('deads').each(function (stone) {
    if (stone.get('color') === 'black' && this.has('white')) {
      this.get('white').incPrisoners();
    } else if (stone.get('color') === 'white' && this.has('black')) {
      this.get('black').incPrisoners();
    }
  }, this);
};

/* Put a stone on goban, if possible */

Game.prototype.putStone = function (stone) {
  if (!this.gbn()) return false;
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  if (stone.get('color') !== this.get('turn')) return false;
  if (!this.gbn().putStone(stone, this.countPrisoners)) return false;

  this.toggleTurn();
  return true;
};