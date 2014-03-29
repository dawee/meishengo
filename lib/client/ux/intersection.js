var _ = require('underscore');
var UX = require('../ux');

var IntersectionUX = module.exports = function (goban, row, col) {
  _.bindAll(this, 'putStone', 'click', 'hover', 'hout');

  this.goban = goban;
  this.el = document.createElement('div');
  this.el.setAttribute('class', 'intersection');
  this.row = row;
  this.col = col;
  this.el.addEventListener('click', this.click);
  this.el.addEventListener('mouseover', this.hover);
};

var ux = IntersectionUX.prototype = new UX();
var lastFocus = null;

ux.putStone = function (evt) {
  _.each(document.querySelectorAll('.intersection.latest'), function (el) {
    el.classList.remove('latest');
  });
  this.stone.classList.add('put');
  this.el.classList.add('latest');
  this.stone.classList.add(evt.color);
};

ux.removeStone = function (evt) {
  this.stone.classList.remove('put');
  this.stone.classList.remove('black');
  this.stone.classList.remove('white');
};

ux.click = function () {
  if (document.querySelector('#game .goban').classList.contains('unlocked')) {
    this.emit('stone:put', {row: this.row, col: this.col, color: this.color, ux: true});
  }
};

ux.hout = function () {
  if (this.stone.classList.contains('put')) return;
  this.stone.classList.remove('black');
  this.stone.classList.remove('white');
  lastFocus = null;
};

ux.hover = function () {
  if (!!lastFocus && lastFocus !== this) lastFocus.hout();
  if (!this.color) return;
  if (!this.goban.canPutStone(this.row, this.col, this.color)) return;

  this.stone.classList.add(this.color);
  lastFocus = this;
};

ux.render = function () {
  var gap = this.goban.size > 9 ? 4 : 3;
  var isGapFromColWall = (this.col === gap - 1) || (this.goban.size - this.col === gap);
  var isGapFromRowWall = (this.row === gap - 1) || (this.goban.size - this.row === gap);
  var isRowCentered = (this.row === (this.goban.size - 1) / 2) && this.goban.size > 9;
  var isColCentered = (this.col === (this.goban.size - 1) / 2) && this.goban.size > 9;
  var isWallHoshi = (isGapFromRowWall || isGapFromColWall) && (isColCentered || isRowCentered);
  var isCornerHoshi = isGapFromColWall && isGapFromRowWall;
  var isCenterHoshi = isRowCentered && isColCentered;

  if (this.row === 0) this.el.classList.add('top');
  if (this.row === this.goban.size - 1) this.el.classList.add('bottom');
  if (this.col === 0) this.el.classList.add('left');
  if (this.col === this.goban.size - 1) this.el.classList.add('right');
  if (isCornerHoshi || isWallHoshi || isCenterHoshi) this.el.classList.add('hoshi');

  this.stone = document.createElement('div');
  this.stone.classList.add('stone');
  this.el.appendChild(this.stone);
  return this;
}











