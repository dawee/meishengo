/*
 * Module dependencies
 */

var Mei = require('./mei');

/*
 * Player model
 */

var Player = module.exports = Mei.Model.extend({
  defaults: {
    prisoners: 0
  },
  schema: {
    prisoners: Number
  }
});


/* Increment prisoners */

Player.prototype.incPrisoners = function () {
  this.set('prisoners', this.get('prisoners') + 1);
};