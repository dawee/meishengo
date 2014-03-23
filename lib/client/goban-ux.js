var _ = require('underscore');
var events = require('events');
var IntersectionUX = require('./intersection-ux');

var GobanUX = module.exports = function (goban) {
	_.bindAll(this, 'lock', 'unlock', 'showStone');

  this.goban = goban;
	this.el = document.createElement('div');
	this.el.setAttribute('id', 'goban');
  this.el.classList.add('size-' + goban.size);
  this.evts = new events.EventEmitter();
  this.intersections = {};
};

var ux = GobanUX.prototype;

ux.setColor = function (color) {
  this.el.classList.add(color);
  _.values(this.intersections).forEach(function (intersectionUX) {
    intersectionUX.color = color;
  });
};

ux.on = function (name, cbk) {
  this.evts.on(name, cbk);
};

ux.emit = function (name, data) {
  this.evts.emit(name, data);
};

ux.unlock = function () {
  console.log('unlock goban')
  this.el.classList.add('unlocked');
};

ux.lock = function () {
  console.log('lock goban')
  this.el.classList.remove('unlocked');
};

ux.showStone = function (evt) {
  this.intersections[evt.row + ':' + evt.col].putStone(evt);
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
        this.goban.putStone(data);
      }, this));
      
      this.intersections[row + ':' + col] = intersectionUX;
      line.appendChild(intersectionUX.render().el);
    }

    intersections.appendChild(line);
  }

  this.el.appendChild(intersections);
  return this;
};

