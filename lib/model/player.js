'use strict';

/*
 * Module dependencies
 */

var Mei = require('../mei');

/*
 * Player model
 */

var Player = module.exports = Mei.Model.extend({
  defaults: {
    prisoners: 0
  },
  schema: {
    prisoners: Number,
    nickname: String
  }
});


/* Increment prisoners */

Player.prototype.incPrisoners = function (increment) {
  this.set('prisoners', this.get('prisoners') + (increment || 1));
};