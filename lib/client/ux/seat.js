var _ = require('underscore');
var UX = require('../ux');

var SeatUX = module.exports = function (color) {
  _.bindAll(this, 'taken', 'free');

  this.color = color;
  this.el = document.createElement('div');
  this.el.classList.add('seat');
  this.el.classList.add('free');
  this.el.classList.add(this.color);
};

var ux = SeatUX.prototype = new UX();


ux.taken = function () {
  this.el.classList.remove('free');
};

ux.free = function () {
  this.el.classList.add('free');
};

ux.setOwner = function (owner) {
  this.el.classList.add(owner);
};

ux.render = function () {
  var label = document.createElement('span');
  label.classList.add('label');
  label.appendChild(document.createTextNode(this.color));
  this.el.appendChild(label);
  return this;
};
