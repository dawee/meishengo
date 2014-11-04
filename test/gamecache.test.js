var assert = require('assert');
var _ = require('underscore');
var unflatten = require('flat').unflatten;
var GameCache = require('../lib/cache/game');
var fixtures = {
  's19bCenter': require('./fixtures/game-19x19-center-black-group')
};

describe('GameCache', function () {

  it('should save flatten data on Redis', function (done) {
    var game = GameCache.create(_.extend({
      id: 'my-game'
    }, fixtures.s19bCenter));

    game.save(null, {
      success: function () {
        GameCache.fetch('my-game', function (err, model) {
          assert.equal(true, !!model);
          done();
        });
      },
      error: function (model, err) {
        throw err;
      }
    });
  });

  it('should not find this game' , function (done) {
    GameCache.fetch('i-dont-exist', function (err, model) {
      assert.equal(false, !!model);
      done();
    });
  });

  it('should be usable for reset', function (done) {
    var game = GameCache.create({id: 'my-game'});

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


  it('should delete an existing game from Redis', function (done) {
    var game = GameCache.create({id: 'my-game'});

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