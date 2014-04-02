var assert = require('assert');
var _ = require('underscore');
var Referee = require('../lib/common/referee');
var Stone = require('../lib/common/stone');

describe('Referee', function () {

  describe('countTerritories()', function () {

    it('should have only one big black territory', function (done) {
      var referee = new Referee([
        [
          {row: 8, col: 8, color: 'black'},
          {row: 8, col: 9, color: 'black'},
          {row: 8, col: 10, color: 'black'},
        ]
      ], 19);

      referee.verbose = true;

      referee.countTerritories(function (territories) {
        assert.equal(territories.length, 1);
        assert.equal(territories[0].intersections.length, 358);
        assert.equal(territories[0].color, 'black');

        done();
      });

    });

    it('should have only one big dame territory', function (done) {
      var referee = new Referee([
        [
          {row: 8, col: 8, color: 'black'},
          {row: 8, col: 9, color: 'black'},
          {row: 8, col: 10, color: 'white'},
        ]
      ], 19);

      referee.verbose = true;

      referee.countTerritories(function (territories) {
        assert.equal(territories.length, 1);
        assert.equal(territories[0].intersections.length, 358);
        assert.equal(territories[0].color, 'dame');

        done();
      });

    });

    it('should have only a big dame territory and 1-point black territory', function (done) {
      var referee = new Referee([
        [
          {row: 9, col: 8, color: 'black'},
          {row: 8, col: 9, color: 'black'},
          {row: 9, col: 10, color: 'black'},
          {row: 10, col: 9, color: 'black'},
          {row: 0, col: 0, color: 'white'},
        ]
      ], 19);

      referee.verbose = true;

      referee.countTerritories(function (territories) {
        assert.equal(territories.length, 2);
        assert.equal(territories[0].intersections.length, 355);
        assert.equal(territories[0].color, 'dame');
        assert.equal(territories[1].intersections.length, 1);
        assert.equal(territories[1].color, 'black');
        done();
      });

    });


  });

});