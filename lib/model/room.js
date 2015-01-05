'use strict';

/*
 * Module dependencies
 */

var Mei = require('../mei');


var HISTORY_MAX_ENTRIES = 10;

/*
 * Messages history Model & Collection
 */

var MessageEntry = Mei.Model.extend({
  schema: {
    nickname: String,
    content: String
  }
});

var MessagesHistory = Mei.Collection.extend({
  model: MessageEntry
});


/*
 * Room model
 */

var Room = module.exports = Mei.Model.extend({
  schema: {
    history: MessagesHistory
  }
});

Room.HISTORY_MAX_ENTRIES = HISTORY_MAX_ENTRIES;

/* Push message and limit size */

Room.prototype.putMessage = function (nickname, content) {
  this.history().push(new MessageEntry({
    nickname: nickname,
    content: content
  }));

  while (this.history().size() > HISTORY_MAX_ENTRIES) this.history().shift();
};
