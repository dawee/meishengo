var assert = require('assert');
var Mei = require('../lib/mei');


describe('Mei', function () {

  describe('Model', function () {
    var Machine = Mei.Model.extend({
      schema: {
        activated: Boolean
      }
    });

    describe('constructor()', function () {

      it('should convert int value to Boolean', function () {
        var machine;

        machine = new Machine({activated: 1});
        assert.equal(true, machine.get('activated'));
        machine = new Machine({activated: 0});
        assert.equal(false, machine.get('activated'));
      });

      it('should convert string value to Boolean', function () {
        var machine;

        machine = new Machine({activated: '1'});
        assert.equal(true, machine.get('activated'));
        machine = new Machine({activated: '0'});
        assert.equal(false, machine.get('activated'));
      });

    });

    describe('set()', function () {

      it('should convert int value to Boolean', function () {
        var machine = new Machine();

        machine.set('activated', 1);
        assert.equal(true, machine.get('activated'));
        machine.set('activated', 0);
        assert.equal(false, machine.get('activated'));
      });

    });

    describe('serialize()', function () {

      it('should convert Boolean value to int', function () {
        var machine = new Machine({activated: true});

        assert.equal(1, machine.serialize().activated);
        machine.set('activated', false);
        assert.equal(0, machine.serialize().activated);
      });

    });

  });

});
