var _ = require('underscore');
var events = require('events');

var BowlUX = module.exports = function (owner) {
  this.el = document.createElement('div');
  this.el.classList.add('bowl');
  this.el.classList.add('closed');
  this.el.classList.add(owner);
  this.evts = new events.EventEmitter();
};

var ux = BowlUX.prototype;

ux.on = function (name, cbk) {
  this.evts.on(name, cbk);
};

ux.emit = function (name, data) {
  this.evts.emit(name, data);
};

ux.setColor = function (color) {
  this.el.classList.add(color);
};

ux.render = function () {
  return this;
};