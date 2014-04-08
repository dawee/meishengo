var _ = require('underscore');
var UX = require('../ux');
var IntersectionUX = require('./intersection');

var GobanUX = module.exports = function (goban) {
	UX.apply(this);
  _.bindAll(this, 'lock', 'unlock', 'showStone', 'hideStone', 'markStone', 'showTerritories');

  this.goban = goban;
	this.el = document.createElement('div');
  this.el.classList.add('goban');
  this.el.classList.add('size-' + goban.size);
  this.intersections = {};
  this.goban.on('stone:put', this.showStone);
  this.goban.on('stone:remove', this.hideStone);
  this.goban.on('markup:dead', this.markStone)
};

var ux = GobanUX.prototype;
_.extend(ux, UX.prototype);

ux.setColor = function (color) {
  this.el.classList.add(color);
  _.values(this.intersections).forEach(function (intersectionUX) {
    intersectionUX.color = color;
  });
};

ux.unlock = function () {
  this.el.classList.add('unlocked');
};

ux.lock = function () {
  this.el.classList.remove('unlocked');
};

ux.showStone = function (evt) {
  this.intersections[evt.row + ':' + evt.col].putStone(evt);
};

ux.hideStone = function (evt) {
  this.intersections[evt.row + ':' + evt.col].removeStone(evt);
};

ux.markStone = function (evt) {
  if (evt.value === true) this.intersections[evt.row + ':' + evt.col].markStoneAsDead();
  if (evt.value === false) this.intersections[evt.row + ':' + evt.col].unmarkStoneAsDead();
  this.goban.countTerritories(this.showTerritories);
};

ux.showTerritories = function (territories) {
  var seen = [];

  _.each(territories, function (territory) {
    _.each(territory.intersections, function (itr) {
      this.intersections[itr.row + ':' + itr.col].setTerritory(territory.color);
      seen.push(itr.row + ':' + itr.col);
    }, this);
  }, this);

  _.each(this.intersections, function (intersection) {
    if (!_.contains(seen, intersection.row + ':' + intersection.col)) intersection.unsetTerritory();
  });
};

ux.render = function () {
  var that = this;
  var intersections = document.createElement('div');
	var row = 0;
  var col = 0;

  intersections.classList.add('intersections');

  for (row = 0; row < this.goban.size; row++) {
    var line = document.createElement('div');
    line.classList.add('line');

    for (col = 0; col < this.goban.size; col++) {

      var intersectionUX = new IntersectionUX(this.goban, row, col);
      intersectionUX.on('stone:put', function (data) {
        that.emit('stone:put', data);
      });

      intersectionUX.on('stone:markup:toggle', function (data) {
        that.emit('stone:markup:toggle', data);
      });
      
      this.intersections[row + ':' + col] = intersectionUX;
      line.appendChild(intersectionUX.render().el);
    }

    intersections.appendChild(line);
  }

  this.el.appendChild(intersections);
  this.goban.emitAll();
  return this;
};

