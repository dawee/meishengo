var _ = require('underscore');
var Stone = require('./stone');
var StoneGroup = require('./stonegroup');
var events = require('events');


var Referee = module.exports = function (groups, gsize) {
  _.bindAll(this, 'tick');

  this.stones = [];
  this.territories = [];
  this.examinated = {};
  this.gsize = gsize;
  this.evts = new events.EventEmitter();
  this.differed = [];

  _.each(groups, function (group) {
    // Ignore groups with 'dead' markup
    if (group.dead) return;
    if (!(group instanceof StoneGroup)) group = new StoneGroup(group);

    _.each(group.toStoneArray(), function (stone) {
      this.stones.push(stone.toString());
    }, this);
  }, this);
};

var referee = Referee.prototype;

referee.countTerritories = function (done) {
  var row = 0;
  var col = 0;
  this.t0 = Date.now();

  this.done = done || function noop() {};
  var count = 0;

  for (row = 0; row < this.gsize; row++) {
    for (col = 0; col < this.gsize; col++) {
      this.territories.push({intersections: [], id: this.territories.length});
      this.checkIntersection(_.last(this.territories), row, col);
      count++;
    }
  }

  _.defer(this.tick);
};

referee.checkIntersection = function (territory, row, col) {
  var blackStoneHere = new Stone({row: row, col: col, color: 'black'});
  var whiteStoneHere = new Stone({row: row, col: col, color: 'white'});
  var noStoneHere = new Stone({row: row, col: col, color: 'blank'});

  if (territory.removed) return;
  if (row < 0 || col < 0) return;
  if (row >= this.gsize || col >= this.gsize) return;

  // Already examinated by another territory : remove current territory
  if (_.has(this.examinated, noStoneHere.toString())) {
    var eaterId = this.examinated[noStoneHere.toString()];
    var eater = this.territories[eaterId];

    if (eaterId !== territory.id && !eater.removed) {

      _.each(territory.intersections, function (stoneNoStone) {
        delete this.examinated[stoneNoStone.toString()];
        this.deferNewCheck(eater, stoneNoStone);
      }, this);

      territory.removed = true;
    }
    return;
  } 

  // Touched black stone
  if (_.contains(this.stones, blackStoneHere.toString())) {
    if (territory.color === 'white') territory.color = 'dame';
    if (!territory.color) territory.color = 'black';
    return;
  }

  // Touched white stone
  if (_.contains(this.stones, whiteStoneHere.toString())) {
    if (territory.color === 'black') territory.color = 'dame';
    if (!territory.color) territory.color = 'white';
    return;
  }

  territory.intersections.push(noStoneHere);
  this.examinated[noStoneHere.toString()] = territory.id;
  this.deferNewCheck(territory, noStoneHere.topStone());
  this.deferNewCheck(territory, noStoneHere.rightStone());
  this.deferNewCheck(territory, noStoneHere.bottomStone());
  this.deferNewCheck(territory, noStoneHere.leftStone());
};

referee.deferNewCheck = function (territory, stoneNoStone) {
  var that = this;

  this.differed.push(function () {
    that.checkIntersection(territory, stoneNoStone.row, stoneNoStone.col);
  });
};

referee.tick = function () {
  var differed = this.differed;
  this.differed = [];

  _.each(differed, function (task) {
    task();
  });

  if (this.differed.length === 0) {
    var filtered = _.filter(this.territories, function (territory) {
      return !territory.removed && territory.intersections.length > 0;
    });

    if (this.verbose) console.log('Counted territories in', Date.now() - this.t0, 'ms.');
    return this.done(filtered);
  }

  _.defer(this.tick);
};

