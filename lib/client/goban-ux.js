var GobanUX = module.exports = function (goban) {
	this.goban = goban;
	this.el = document.createElement('div');
	this.el.setAttribute('id', 'goban');
};

var ux = GobanUX.prototype;

ux.render = function () {
  var intersections = document.createElement('div');
  var line = {};
  var intersection = {};
  var stone = {};
	var row = 0;
  var col = 0;
  var gap = this.goban.size > 9 ? 4 : 3;
  var isGapFromColWall = false;
  var isGapFromRowWall = false;
  var isCornerHoshi = false;
  var isWallHoshi = false;
  var isCenterHoshi = false;
  var isRowCentered = false;
  var isColCentered = false;

  intersections.classList.add('intersections');
  this.el.appendChild(intersections);

  for (row = 0; row < this.goban.size; row++) {
    line = document.createElement('div');
    line.classList.add('line');

    for (col = 0; col < this.goban.size; col++) {
      intersection = document.createElement('div');
      intersection.classList.add('intersection');
      if (row === 0) intersection.classList.add('top');
      if (row === this.goban.size - 1) intersection.classList.add('bottom');

      if (col === 0) intersection.classList.add('left');
      if (col === this.goban.size - 1) intersection.classList.add('right');

      isGapFromColWall = (col === gap - 1) || (this.goban.size - col === gap);
      isGapFromRowWall = (row === gap - 1) || (this.goban.size - row === gap);
      isCornerHoshi = isGapFromColWall && isGapFromRowWall;
      isRowCentered = (row === (this.goban.size - 1) / 2) && this.goban.size > 9;
      isColCentered = (col === (this.goban.size - 1) / 2) && this.goban.size > 9;
      isWallHoshi = (isGapFromRowWall || isGapFromColWall) && (isColCentered || isRowCentered);
      isCenterHoshi = (isRowCentered && isColCentered);

      if (isCornerHoshi || isWallHoshi || isCenterHoshi) intersection.classList.add('hoshi');

      stone = document.createElement('div');
      stone.classList.add('stone');
      intersection.appendChild(stone);

      stone.addEventListener('click', function () {
        this.classList.add('put');
      });

      line.appendChild(intersection);
    }

    intersections.appendChild(line);
  }


  return this;
};

