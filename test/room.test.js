var assert = require('assert');
var Room = require('../lib/model/room');


describe('Room', function () {

  describe('putMessage()', function () {
    it('should add message content to entries history', function () {
      var room = new Room();

      room.putMessage('sai', 'arigato');
      assert.equal('sai', room.history().at(0).author());
      assert.equal('arigato', room.history().at(0).content());
    });

    it('should limit history', function () {
      var room = new Room();
      var index = 0;

      for (index = 0; index < 2 * Room.HISTORY_MAX_ENTRIES; index++) {
        room.putMessage('sai', 'arigato');
      }

      assert.equal(Room.HISTORY_MAX_ENTRIES, room.history().size());
    });

  });
});
