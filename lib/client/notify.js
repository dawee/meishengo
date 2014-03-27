var _ = require('underscore');

var notify = module.exports = function (message) {
  if (tid !== null) clearTimeout(tid);
  msg = message;
  notify.start();

  if (!handlesClick) {
    handlesClick = true;
    document.body.addEventListener('mouseover', notify.cancel);
  }
};

var MESSAGE_DURATION = 500;
var DEFAULT_DURATION = 700;

var tid = null;
var deflt = 'Meishengo';
var active = false;
var msg = null;
var handlesClick = false;

notify.cancel = function () {
  active = false;
  msg = null;
  _.defer(notify.showDefault);
  if (tid !== null) clearTimeout(tid);
};

notify.start = function () {
  active = true;
  notify.showMessage();
  tid = setTimeout(notify.showDefault, MESSAGE_DURATION);
};

notify.setTitle = function (text) {
  document.querySelector('head title').firstChild.data = text;
};


notify.showDefault = function () {
  notify.setTitle(deflt);

  if (!active) return;
  tid = setTimeout(notify.showMessage, DEFAULT_DURATION);
};

notify.showMessage = function () {
  if (!active) return;
  if (!!msg) notify.setTitle(msg);
  tid = setTimeout(notify.showDefault, MESSAGE_DURATION);
};

