var assert = require('assert');
var _ = require('underscore');
var Transaction = require('../lib/common/transaction');
var Stone = require('../lib/common/stone');

describe('Transaction', function () {

  describe('attachToAll()', function () {

    it('should attach to every groups', function () {
      var transaction = new Transaction([
        [
          {row: 8, col: 8, color: 'black'},
          {row: 8, col: 9, color: 'black'},
          {row: 8, col: 10, color: 'black'},
        ],
        [
          {row: 5, col: 5, color: 'black'},
          {row: 6, col: 5, color: 'black'},
          {row: 7, col: 5, color: 'black'},
        ]
      ], 19);

      transaction.groups[0].firstOne = true;
      transaction.stone = new Stone({row: 8, col: 11, color: 'black'});
      transaction.attachToAll();

      assert.equal(1, transaction.attachedTo.length);
      assert.equal(true, transaction.attachedTo[0].firstOne);
    });

    it('should attach to every groups', function () {
      var transaction = new Transaction([
        [
          {row: 8, col: 9, color: 'black'},
          {row: 8, col: 10, color: 'black'},
        ],
        [
          {row: 9, col: 8, color: 'black'},
          {row: 10, col: 8, color: 'black'},
          {row: 11, col: 8, color: 'black'},
        ],
        [
          {row: 8, col: 7, color: 'black'},
          {row: 8, col: 6, color: 'black'},
          {row: 8, col: 5, color: 'black'},
        ],
      ], 19);

      transaction.stone = new Stone({row: 8, col: 8, color: 'black'});
      transaction.attachToAll();

      assert.equal(3, transaction.attachedTo.length);
    });

  });

  describe('mergeGroups()', function () {

    it('should reduce to one big group', function () {

      var transaction = new Transaction([
        [
          {row: 8, col: 9, color: 'black'},
          {row: 8, col: 10, color: 'black'},
        ],
        [
          {row: 9, col: 8, color: 'black'},
          {row: 10, col: 8, color: 'black'},
          {row: 11, col: 8, color: 'black'},
        ],
        [
          {row: 8, col: 7, color: 'black'},
          {row: 8, col: 6, color: 'black'},
          {row: 8, col: 5, color: 'black'},
        ],
      ], 19);

      transaction.stone = new Stone({row: 8, col: 8, color: 'black'});
      transaction.attachToAll();
      transaction.mergeGroups();

      assert.equal(1, transaction.attachedTo.length);
      assert.equal(9, transaction.attachedTo[0].size());
    });

    it('should generate a group if no existing can attach', function () {

      var transaction = new Transaction([
        [
          {row: 8, col: 9, color: 'black'},
          {row: 8, col: 10, color: 'black'},
        ],
        [
          {row: 9, col: 8, color: 'black'},
          {row: 10, col: 8, color: 'black'},
          {row: 11, col: 8, color: 'black'},
        ],
        [
          {row: 8, col: 7, color: 'black'},
          {row: 8, col: 6, color: 'black'},
          {row: 8, col: 5, color: 'black'},
        ],
      ], 19);

      transaction.stone = new Stone({row: 1, col: 1, color: 'black'});
      transaction.attachToAll();
      transaction.mergeGroups();

      assert.equal(1, transaction.attachedTo.length);
      assert.equal(1, transaction.attachedTo[0].size());
      assert.equal(4, transaction.groups.length);
    });

  });


});