var _ = require('underscore');

var Popup = module.exports = function (name) {
  _.bindAll(this, '_show', '_reduce', '_hide', 'show', 'hide');
  this.el = document.querySelector('.popup.' + name);
};

var popup = Popup.prototype;

popup._show = function () {
  this.el.classList.remove('hidden');
  this.el.classList.remove('reduced');
};

popup._reduce = function () {
  this.el.classList.add('reduced');
};

popup._hide = function () {
  this.el.classList.add('hidden');
  
  if (!!this.hidden) {
    this.hidden();
    this.hidden = false;
  }
};

popup.show = function () {
  _.defer(this._show);
  return this;
};

popup.hide = function (cbk) {
  this.hidden = cbk

  _.defer(this._reduce);
  _.delay(this._hide, 500);
  return this;
};