var assert = require('assert');
var _ = require('underscore');
var Goban = require('../lib/common/goban');

describe('Goban', function () {

  describe('addGroupMarkupAt()', function () {

    it('should set "foobar" to true', function () {
      var goban = new Goban({groups: [
        [{row: 9, col: 9, color: 'black'}]
      ], editable: true});

      goban.addGroupMarkupAt(9, 9, 'foobar');
      assert.equal(true, goban.groups[0].foobar);
    });

  });

  describe('rmGroupMarkupAt()', function () {

    it('should set "foobar" to true', function () {
      var goban = new Goban({groups: [
        [{row: 9, col: 9, color: 'black'}]
      ], editable: true});

      goban.rmGroupMarkupAt(9, 9, 'foobar');
      assert.equal(false, goban.groups[0].foobar);
    });

  });

  describe('hasGroupMarkupAt()', function () {

    it('should retreive true', function () {
      var goban = new Goban({groups: [
        [{row: 9, col: 9, color: 'black'}]
      ], editable: true});

      goban.addGroupMarkupAt(9, 9, 'foobar');
      assert.equal(true, goban.hasGroupMarkupAt(9, 9, 'foobar'));
    });

  });

  describe('toggleGroupMarkupAt()', function () {

    it('should set "foobar" to true', function () {
      var goban = new Goban({groups: [
        [{row: 9, col: 9, color: 'black'}]
      ], editable: true});

      goban.toggleGroupMarkupAt(9, 9, 'foobar');
      assert.equal(true, goban.groups[0].foobar);
    });

   it('should toggle "foobar" to false', function () {
      var goban = new Goban({groups: [
        [{row: 9, col: 9, color: 'black'}]
      ], editable: true});

      goban.toggleGroupMarkupAt(9, 9, 'foobar');
      goban.toggleGroupMarkupAt(9, 9, 'foobar');
      assert.equal(false, goban.groups[0].foobar);
    });

   it('should send "markup:foobar" event', function (done) {
      var goban = new Goban({groups: [
        [{row: 9, col: 9, color: 'black'}]
      ], editable: true});

      goban.on('markup:foobar', function (args) {
        assert.equal(true, args.value);
        assert.equal(9, args.row);
        assert.equal(9, args.col);
        done();
      });

      goban.toggleGroupMarkupAt(9, 9, 'foobar');
    });

  });

});