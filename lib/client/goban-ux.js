var _ = require('underscore');
var events = require('events');
var IntersectionUX = require('./intersection-ux');

var GobanUX = module.exports = function (goban) {
	this.goban = goban;
	this.el = document.createElement('div');
	this.el.setAttribute('id', 'goban');
  this.el.classList.add('size-' + goban.size);
  this.evts = new events.EventEmitter();
};

var ux = GobanUX.prototype;

ux.on = function (name, cbk) {
  this.evts.on(name, cbk);
};

ux.emit = function (name, data) {
  this.evts.emit(name, data);
};

ux.unlock = function () {
  this.el.classList.add('unlocked');
};

ux.lock = function () {
  this.el.classList.remove('unlocked');
};

ux.render = function () {
  var intersections = document.createElement('div');
	var row = 0;
  var col = 0;

  intersections.classList.add('intersections');

  for (row = 0; row < this.goban.size; row++) {
    var line = document.createElement('div');
    line.classList.add('line');

    for (col = 0; col < this.goban.size; col++) {

      var intersectionUX = new IntersectionUX(this.goban, row, col);
      intersectionUX.on('stone:put', _.bind(function (data) {
        this.emit('stone:put', data);
        this.lock();
      }, this));

      this.on('server:stone:put:' + row + ':' + col, _.bind(intersectionUX.putStone, intersectionUX));

      line.appendChild(intersectionUX.render().el);
    }

    intersections.appendChild(line);
  }

  this.el.appendChild(intersections);
  return this;
};

