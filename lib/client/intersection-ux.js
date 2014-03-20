var _ = require('underscore');
var events = require('events');

var IntersectionUX = module.exports = function (goban, row, col) {
  this.goban = goban;
  this.el = document.createElement('div');
  this.el.setAttribute('class', 'intersection');
  this.row = row;
  this.col = col;
  this.evts = new events.EventEmitter();
  this.el.addEventListener('click', _.bind(function () {
    this.putStone(true);
  }, this));
};

var ux = IntersectionUX.prototype;

ux.putStone = function (me) {
  var stone = this.el.querySelector('.stone');
  if (stone.classList.contains('put')) return;

  stone.classList.add('put');
  if (me === true) {
    this.emit('stone:put', {
      row: this.row,
      col: this.col
    });
  } else {
    stone.classList.add('opponent');
  }

};

ux.on = function (name, cbk) {
  this.evts.on(name, cbk);
};

ux.emit = function (name, data) {
  this.evts.emit(name, data);
};

ux.render = function () {
  var stone = document.createElement('div');
  var gap = this.goban.size > 9 ? 4 : 3;
  var isGapFromColWall = false;
  var isGapFromRowWall = false;
  var isCornerHoshi = false;
  var isWallHoshi = false;
  var isCenterHoshi = false;
  var isRowCentered = false;
  var isColCentered = false;


  if (this.row === 0) this.el.classList.add('top');
  if (this.row === this.goban.size - 1) this.el.classList.add('bottom');

  if (this.col === 0) this.el.classList.add('left');
  if (this.col === this.goban.size - 1) this.el.classList.add('right');

  isGapFromColWall = (this.col === gap - 1) || (this.goban.size - this.col === gap);
  isGapFromRowWall = (this.row === gap - 1) || (this.goban.size - this.row === gap);
  isCornerHoshi = isGapFromColWall && isGapFromRowWall;
  isRowCentered = (this.row === (this.goban.size - 1) / 2) && this.goban.size > 9;
  isColCentered = (this.col === (this.goban.size - 1) / 2) && this.goban.size > 9;
  isWallHoshi = (isGapFromRowWall || isGapFromColWall) && (isColCentered || isRowCentered);
  isCenterHoshi = (isRowCentered && isColCentered);

  if (isCornerHoshi || isWallHoshi || isCenterHoshi) this.el.classList.add('hoshi');


  stone.classList.add('stone');
  this.el.appendChild(stone);
  return this;
}











