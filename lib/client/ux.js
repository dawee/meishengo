var events = require('events');

var UX = module.exports = function () {
  this.evts = new events.EventEmitter();
}

var ux = UX.prototype;

ux.on = function (name, cbk) {
  this.evts.on(name, cbk);
};

ux.emit = function (name, data) {
  this.evts.emit(name, data);
};

ux.render = function () {
  return this;
};