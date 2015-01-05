'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var Mei = require('../mei');
var Goban = require('./goban');
var Player = require('./player');
var Room = require('./room');
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
    goban: Goban,
    black: Player,
    white: Player,
    room: Room
  }
});

/* Switch between the 2 possible values : black & white */

Game.prototype.toggleTurn = function () {
  this.set('turn', this.get('turn') === 'black' ? 'white' : 'black');
};

/* Checks if stone simulation went well */

Game.prototype.canPutStone = function (stone) {
  if (!this.goban()) return false;
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  if (stone.get('color') !== this.get('turn')) return false;

  return this.goban().canPutStone(stone);
};

/* Put a stone on goban, if possible */

Game.prototype.putStone = function (stone) {
  var that = this;

  if (!this.goban()) return false;

  this.goban().off('capture');
  this.goban().on('capture', function (group) {
    that.get(stone.get('color')).incPrisoners(group.get('stones').size());
  });

  if (!(stone instanceof Stone)) stone = new Stone(stone);
  if (stone.get('color') !== this.get('turn')) return false;
  if (!this.goban().putStone(stone)) return false;

  this.toggleTurn();
  return true;
};