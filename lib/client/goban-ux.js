var GobanUX = module.exports = function (goban) {
	this.goban = goban;
	this.el = document.createElement('div');
	this.el.setAttribute('id', 'goban');
};

var ux = GobanUX.prototype;

ux.render = function () {
	return this;
};

