var assert = require('assert');
var _ = require('underscore');
var Backbone = require('backbone');
var Transaction = require('../lib/model/transaction');
var Stone = require('../lib/model/stone');
var StoneGroup = require('../lib/model/stonegroup');

var StoneGroupArray = Backbone.Collection.extend({model: StoneGroup});

describe('Transaction', function () {

  describe('attachToAll()', function () {

    it('should attach to every groups', function () {
      var transaction = new Transaction({groups: new StoneGroupArray([
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
      ]), gsize: 19});

      transaction.get('groups').at(0).firstOne = true;
      transaction.set('stone', new Stone({row: 8, col: 11, color: 'black'}));
      transaction.attachToAll();

      assert.equal(1, transaction.get('attachedTo').size());
      assert.equal(true, transaction.get('attachedTo').at(0).firstOne);
    });

    it('should attach to every groups', function () {
      var transaction = new Transaction({groups: new StoneGroupArray([
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
      ]), gsize: 19});

      transaction.set('stone', new Stone({row: 8, col: 8, color: 'black'}));
      transaction.attachToAll();

      assert.equal(3, transaction.get('attachedTo').size());
    });

  });

  describe('mergeGroups()', function () {

    it('should reduce to one big group', function () {

      var transaction = new Transaction({groups: new StoneGroupArray([
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
      ]), gsize: 19});

      transaction.set('stone', new Stone({row: 8, col: 8, color: 'black'}));
      transaction.attachToAll();
      transaction.mergeGroups();

      assert.equal(1, transaction.get('attachedTo').size());
      assert.equal(9, transaction.get('attachedTo').at(0).size());
    });

    it('should generate a group if no existing can attach', function () {
      var transaction = new Transaction({groups: new StoneGroupArray([
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
      ]), gsize: 19});

      transaction.set('stone', new Stone({row: 1, col: 1, color: 'black'}));
      transaction.attachToAll();
      transaction.mergeGroups();

      assert.equal(4, transaction.get('groups').size());
      assert.equal(1, transaction.get('attachedTo').size());
      assert.equal(1, transaction.get('attachedTo').at(0).size());
    });

  });

  describe('removeDeadGroups()', function () {

    it('should remove the 2-stones white group', function () {
      var transaction = new Transaction({groups: new StoneGroupArray([
        [
          {row: 8, col: 8, color: 'black'},
          {row: 8, col: 9, color: 'black'},
          {row: 8, col: 10, color: 'black'},
          {row: 8, col: 11, color: 'black'},
          {row: 9, col: 11, color: 'black'},
          {row: 10, col: 11, color: 'black'},
          {row: 10, col: 8, color: 'black'},
          {row: 10, col: 9, color: 'black'},
          {row: 9, col: 8, color: 'black'},
        ],
        [
          {row: 9, col: 9, color: 'white'},
          {row: 9, col: 10, color: 'white'},
        ]
      ]), gsize: 19});

      transaction.set('stone', new Stone({row: 10, col: 10, color: 'black'}));
      transaction.attachToAll();
      transaction.mergeGroups();
      transaction.removeDeadGroups();
      assert.equal(1, transaction.get('groups').size());
      assert.equal('black', transaction.get('groups').at(0).get('stones').at(0).get('color'));
    });

    it('should not remove any group', function () {
      var transaction = new Transaction({groups: new StoneGroupArray([
        [
          {row: 8, col: 8, color: 'black'},
          {row: 8, col: 9, color: 'black'},
          {row: 8, col: 10, color: 'black'},
          {row: 8, col: 11, color: 'black'},
          {row: 9, col: 11, color: 'black'},
          {row: 10, col: 11, color: 'black'},
          {row: 10, col: 8, color: 'black'},
          {row: 10, col: 9, color: 'black'},
          {row: 9, col: 8, color: 'black'},
          {row: 10, col: 10, color: 'black'}
        ],
        [
          {row: 9, col: 9, color: 'white'}
        ]
      ]), gsize: 19});

      transaction.set('stone', new Stone({row: 9, col: 10, color: 'white'}));
      transaction.attachToAll();
      transaction.mergeGroups();
      transaction.removeDeadGroups();
      assert.equal(2, transaction.get('groups').size());
    });

  });

  describe('putStone()', function () {

    it('should be ok to put the stone', function () {
      var transaction = new Transaction({groups: new StoneGroupArray([
        [
          {row: 8, col: 8, color: 'black'},
          {row: 8, col: 9, color: 'black'},
          {row: 8, col: 10, color: 'black'},
          {row: 8, col: 11, color: 'black'},
          {row: 9, col: 11, color: 'black'},
          {row: 10, col: 11, color: 'black'},
          {row: 10, col: 8, color: 'black'},
          {row: 10, col: 9, color: 'black'},
          {row: 9, col: 8, color: 'black'},
        ],
        [
          {row: 9, col: 9, color: 'white'},
          {row: 9, col: 10, color: 'white'},
        ]
      ]), gsize: 19});
     
      assert.equal(true, transaction.putStone(new Stone({row: 10, col: 10, color: 'black'})));
    });

    it('should not be ok to put the stone', function () {
      var transaction = new Transaction({groups: new StoneGroupArray([
        [
          {row: 8, col: 8, color: 'black'},
          {row: 8, col: 9, color: 'black'},
          {row: 8, col: 10, color: 'black'},
          {row: 8, col: 11, color: 'black'},
          {row: 9, col: 11, color: 'black'},
          {row: 10, col: 11, color: 'black'},
          {row: 10, col: 8, color: 'black'},
          {row: 10, col: 9, color: 'black'},
          {row: 9, col: 8, color: 'black'},
          {row: 10, col: 10, color: 'black'}
        ],
        [
          {row: 9, col: 9, color: 'white'}
        ]
      ]), gsize: 19});

      var res = transaction.putStone(new Stone({row: 9, col: 10, color: 'white'}));
      assert.equal(false, res);
    });

  });


});