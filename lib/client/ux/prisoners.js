var _ = require('underscore');
var UX = require('../ux');

var PrisonersUX = module.exports = function (val) {
  this.el = document.createElement('div');
  this.el.classList.add('prisoners');
  this.val = val || 0;
};

var ux = PrisonersUX.prototype = new UX();

ux.renderValue = function () {
  this.el.firstChild.data = 'x ' + this.val;
};


ux.setValue = function (val) {
  this.val = val;
  this.renderValue();
};

ux.render = function () {
  this.el.appendChild(document.createTextNode('0'));
  this.renderValue();
  return this;
}