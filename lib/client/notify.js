var notify = module.exports = function (message) {
  msg = message;
  notify.cancel();
  notify.start();

  if (!handlesClick) {
    handlesClick = true;
    document.body.addEventListener('click', notify.cancel);
  }
};

var MESSAGE_DURATION = 500;
var DEFAULT_DURATION = 1000;

var tid = null;
var deflt = 'Meishengo';
var active = false;
var msg = null;
var handlesClick = false;

notify.cancel = function () {
  if (tid !== null) clearTimeout(tid);
  active = false;
  notify.showDefault();
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
  if (!active) return;
  notify.setTitle(deflt);
  tid = setTimeout(notify.showMessage, DEFAULT_DURATION);
};

notify.showMessage = function () {
  if (!active) return;
  notify.setTitle(msg);
  tid = setTimeout(notify.showDefault, MESSAGE_DURATION);
};

