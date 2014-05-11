/*
 * Module dependencies
 */

var _ = require('underscore');
var Mei = require('./mei');
var Goban = require('./goban');
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
    turn: 'black'
  },
  schema: {
    id: String,
    type: String,
    turn: String,
    goban: Goban
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
  if (!this.gbn()) return false;
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  if (stone.get('color') !== this.get('turn')) return false;
  if (!this.gbn().putStone(stone)) return false;

  this.toggleTurn();
  return true;
};