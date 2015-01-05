var assert = require('assert');
var async = require('async');
var expect = require('chai').expect;
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
        assert.equal(8, game.goban().get('groups').at(0).get('stones').size());
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

  it('should not alter game content', function (done) {
    function putSaveAndTest(stone) {
      return function (tested) {
        var current;
        var backup;

        async.series([
          function fetchCurrent(next) {
            GameCache.fetch('test-replicate', function (err, model) {
              if (err) return next(err);

              current = model;
              next();
            });
          },
          function putAndSave(next) {
            current.putStone(stone);
            backup = current.serialize();
            current.save(null, {
              success: function () {
                next();
              },
              error: function (model, err) {
                next(err);
              }
            });
          },
          function testFetched(next) {
            GameCache.fetch('test-replicate', function (err, model) {
              if (err) return next(err);

              expect(model.serialize()).to.deep.equal(backup);
              next();
            });
          }
        ], tested);
      };
    }

    function chainSteps() {
      async.series([
        putSaveAndTest({row: 15, col: 14, color: 'white'}),
        putSaveAndTest({row: 15, col: 3, color: 'black'}),
        putSaveAndTest({row: 14, col: 15, color: 'white'}),
        putSaveAndTest({row: 14, col: 3, color: 'black'}),
        putSaveAndTest({row: 15, col: 16, color: 'white'}),
        putSaveAndTest({row: 13, col: 3, color: 'black'}),
      ], function (err) {
        game.destroy({
          success: function () {
            if (err) throw err;
            done();
          },
          error: function (model, err) {
            throw err;
          }
        });
      });
    }

    var game = GameCache.create({
      id: 'test-replicate',
      goban: {size: 19}
    });

    game.save(null, {success: chainSteps});
  });

});