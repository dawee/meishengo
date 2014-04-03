var assert = require('assert');
var _ = require('underscore');
var Goban = require('../lib/common/goban');

describe('Goban', function () {

  describe('toggleGroupMarkupAt()', function () {

    it('should set "foobar" to true', function () {
      var goban = new Goban({groups: [
        [{row: 9, col: 9, color: 'black'}]
      ]});

      goban.toggleGroupMarkupAt(9, 9, 'foobar');
      assert.equal(true, goban.groups[0].foobar);
    });

   it('should toggle "foobar" to false', function () {
      var goban = new Goban({groups: [
        [{row: 9, col: 9, color: 'black'}]
      ]});

      goban.toggleGroupMarkupAt(9, 9, 'foobar');
      goban.toggleGroupMarkupAt(9, 9, 'foobar');
      assert.equal(false, goban.groups[0].foobar);
    });

  });

});