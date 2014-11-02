var assert = require('assert');
var _ = require('underscore');
var Goban = require('../lib/model/goban');
var fixtures = {
  's19SimpleCapture': require('./fixtures/game-19x19-simple-capture')
};

describe('Goban', function () {

  describe('canPutStone()', function () {

    it('should accept a new stone');

    it('should refuse a stone outside of limits');

    it('should refuse a stone if position taken');

    it('should not add a stone to groups');

  });

  describe('putStone()', function () {

    it('should create a new group');

    it('should put a "latest" flag');

    it('should not create the second group');

    it('should keep only 7 groups');
  });
});
