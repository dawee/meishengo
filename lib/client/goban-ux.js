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
	var row = 0;
  var col = 0;
  
  intersections.classList.add('intersections');
  this.el.appendChild(intersections);

  for (row = 0; row < this.goban.size; row++) {
    line = document.createElement('div');
    line.classList.add('line');

    for (col = 0; col < this.goban.size; col++) {
      intersection = document.createElement('div');
      intersection.classList.add('intersection');
      line.appendChild(intersection);
    }

    intersections.appendChild(line);
  }


  return this;
};

