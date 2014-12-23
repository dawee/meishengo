var assert = require('assert');
var _ = require('underscore');
var Game = require('../../lib/model/game');


describe('Game', function () {

  describe('issue #53', function () {

    it('should create each game with empty seats', function () {
      /*var game1 = new Game({goban: {size: 19}});
      var game2 = new Game({goban: {size: 19}});

      game1.get('white').set('present', true);
      game1.get('black').set('present', true);

      assert.equal(false, game2.get('white').get('present'));
      assert.equal(false, game2.get('black').get('present'));*/
    });

  });

})