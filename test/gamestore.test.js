var assert = require('assert');
var _ = require('underscore');
var unflatten = require('flat').unflatten;
var GameStore = require('../lib/store/game');
var fixtures = {
  's19bCenter': require('./fixtures/game-19x19-center-black-group')
};

describe('GameStore', function () {

  it('should save flatten data on Redis', function (done) {
    var game = GameStore.create(_.extend({
      id: 'my-game'
    }, fixtures.s19bCenter));

    game.save(null, {
      success: function () {
        GameStore.exists('my-game', function (err, exists) {
          assert.equal(true, exists);
          done();
        });
      },
      error: function (model, err) {
        throw err;
      }
    });
  });

  it('should not find this game' , function (done) {
    GameStore.exists('i-dont-exist', function (err, exists) {
      assert.equal(false, exists);
      done();
    });
  });

  it('should be usable for reset', function (done) {
    var game = GameStore.create({id: 'my-game'});

    game.fetch({
      success: function () {
        assert.equal(8, game.gbn().get('groups').at(0).get('stones').size());
        done();
      },
      error: function (model, err) {
        throw err;
      }
    });
  });

  it('should not alter booleans', function (done) {
    GameStore.fetch('my-game', function (err, game) {
      if (err) throw err;
      assert.equal(false, game.get('blackPresent'));

      game.destroy();
      done();
    });

  });


  it('should delete an existing game from Redis', function (done) {
    var game = GameStore.create({id: 'my-game'});

    game.destroy({
      success: function () {
        done();
      },
      error: function (model, err) {
        throw err;
      }
    });
  });

});