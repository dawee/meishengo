var assert = require('assert');
var _ = require('underscore');
var unflatten = require('flat').unflatten;
var Game = require('../lib/model/game');
var syncRedis = require('../lib/sync/redis');
var fixtures = {
  's19bCenter': require('./fixtures/game-19x19-center-black-group'),
  's19SimpleCapture': require('./fixtures/game-19x19-simple-capture')
};

describe('Game', function () {

  describe('putStone()', function () {

    it('should accept a first black stone', function () {
      var game = new Game({goban: {size: 19}});

      assert.equal(true, game.putStone({row: 0, col: 0, color: 'black'}));
    });

    it('should refuse a second black stone', function () {
      var game = new Game({goban: {size: 19}});

      assert.equal(true, game.putStone({row: 0, col: 0, color: 'black'}));
      assert.equal(false, game.putStone({row: 1, col: 1, color: 'black'}));
    });

    it('should accept a second white stone', function () {
      var game = new Game({goban: {size: 19}});

      assert.equal(true, game.putStone({row: 0, col: 0, color: 'black'}));
      assert.equal(true, game.putStone({row: 1, col: 1, color: 'white'}));
    });

    it('should refuse a first white stone', function () {
      var game = new Game({goban: {size: 19}});

      assert.equal(false, game.putStone({row: 0, col: 0, color: 'white'}));
    });

    it('should count one prisoners for black player', function () {
      var game = new Game(fixtures.s19SimpleCapture);

      game.set('turn', 'black');

      assert.equal(true, game.putStone({row: 13, col: 17, color: 'black'}));
      assert.equal(1, game.get('black').get('prisoners'));
      assert.equal(0, game.get('white').get('prisoners'));
    });


  });


  describe('serialize()', function () {

    it('should be fully recursive', function () {
      var game = new Game(fixtures.s19bCenter);
      assert.equal(8, game.serialize().goban.groups[0].stones.length);
    });

    it('should be usable for reset', function () {
      var game1 = new Game(fixtures.s19bCenter);
      var game2 = new Game();

      game2.set(game1.serialize());

      assert.equal(8, game2.gbn().get('groups').at(0).get('stones').size());
    });

  });

  describe('flatten()', function () {

    it('should have stones in first depth', function () {
      var game = new Game(fixtures.s19bCenter);
      assert.equal('black', game.flatten()['goban.groups.0.stones.0.color']);
    });

    it('should be usable for reset', function () {
      var game1 = new Game(fixtures.s19bCenter);
      var game2 = new Game();

      game2.set(unflatten(game1.flatten()));

      assert.equal(8, game2.gbn().get('groups').at(0).get('stones').size());
    });

  });

  describe('set()', function () {
    
    it('should generate a goban event', function (done) {
      var game1 = new Game(fixtures.s19bCenter);
      var game2 = new Game(fixtures.s19bCenter);
      
      game1.putStone({row: 18, col: 18, color: 'black'});

      game2.gbn().once('change', function () {
        done();
      });

      game2.set(game1.serialize());

    });


    it('should be usable for updating the whole data', function () {
      var game1 = new Game(fixtures.s19bCenter);
      var game2 = new Game(fixtures.s19bCenter);
      
      var lastGbn = game2.gbn();
      game2.gbn().thisisme = true;

      game1.putStone({row: 18, col: 18, color: 'black'});

      game2.set(game1.serialize());

      assert.equal(18, game2.get('goban').get('groups').last().get('stones').last().get('row'));
      assert.equal(18, game2.get('goban').get('groups').last().get('stones').last().get('col'));
      assert.equal('black', game2.get('goban').get('groups').last().get('stones').last().get('color'));
      assert.equal(true, game2.gbn().thisisme);
    });

  });

});