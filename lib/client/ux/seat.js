var _ = require('underscore');
var UX = require('../ux');
var PrisonersUX = require('./prisoners');

var SeatUX = module.exports = function (color) {
  _.bindAll(this,
    'taken',
    'free',
    'activate',
    'deactivate'
  );

  this.isPlayerSeat = false;
  this.color = color;
  this.el = document.createElement('div');
  this.el.classList.add('seat');
  this.el.classList.add('free');
  this.el.classList.add(this.color);
};

var ux = SeatUX.prototype = new UX();
var actions = ['pass'];

ux.taken = function () {
  this.el.classList.remove('free');
};

ux.free = function () {
  this.el.classList.add('free');
};

ux.setOwner = function (owner) {
  if (owner === 'player') this.isPlayerSeat = true;
  this.el.classList.add(owner);
};

ux.setPrisoners = function (val) {
  this.prisonersUX.setValue(val);
};

ux.activate = function () {
  this.el.classList.add('active');
};

ux.deactivate = function () {
  this.el.classList.remove('active');
};

ux.render = function () {
  var that = this;
  var label = document.createElement('span');

  label.classList.add('label');
  label.appendChild(document.createTextNode(this.color));
  this.el.appendChild(label);
  
  this.prisonersUX = new PrisonersUX();
  this.el.appendChild(this.prisonersUX.render().el);

  var menu = document.createElement('div');
  menu.classList.add('menu');


  _.each(actions, function (action) {
    var actionEl = document.createElement('span');
    actionEl.classList.add('action');
    actionEl.classList.add(action);
    actionEl.appendChild(document.createTextNode(action));
    actionEl.addEventListener('click', function () {
      that.emit('action:' + action);
    });
    menu.appendChild(actionEl);
  }, this);

  this.el.appendChild(menu);
  return this;
};
