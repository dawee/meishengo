var assert = require('assert');
var StoneGroup = require('../lib/common/stonegroup');
var Stone = require('../lib/common/stone');

describe('StoneGroup', function () {

  describe('contains()', function () {

    it('should recognize a stone it owns', function () {
      var stone1 = new Stone({col: 1, row: 1, color: 'black'});
      var group = new StoneGroup(
        stone1,
        {col: 1, row: 2, color: 'black'},
        {col: 1, row: 4, color: 'black'}
      );

      assert.equal(true, group.contains(stone1));
    });

    it('should recognize when it does\'nt own a stone', function () {
      var stone1 = new Stone({col: 1, row: 1, color: 'black'});
      var stone2 = new Stone({col: 1, row: 2, color: 'black'});
      var stone3 = new Stone({col: 1, row: 3, color: 'black'});
      var stone4 = new Stone({col: 1, row: 4, color: 'black'});
      var group = new StoneGroup(stone1, stone2, stone3);

      assert.equal(false, group.contains(stone4));
    });

  });

  describe('attach()', function () {

    it('should be able to add stone', function () {
      var stone1 = new Stone({col: 1, row: 1, color: 'black'});
      var stone2 = new Stone({col: 1, row: 2, color: 'black'});
      var stone3 = new Stone({col: 1, row: 3, color: 'black'});
      var stone4 = new Stone({col: 1, row: 4, color: 'black'});
      var group = new StoneGroup(stone1, stone2, stone3);

      assert.equal(true, group.attach(stone4));
    });

    it('shouldn\'t be able to add stone that is too far', function () {
      var stone1 = new Stone({col: 1, row: 1, color: 'black'});
      var stone2 = new Stone({col: 1, row: 2, color: 'black'});
      var stone3 = new Stone({col: 1, row: 3, color: 'black'});
      var farStone = new Stone({col: 1, row: 5, color: 'black'});
      var group = new StoneGroup(stone1, stone2, stone3);

      assert.equal(false, group.attach(farStone));
    });

    it('should be able to create the group', function () {
      var stone1 = new Stone({col: 1, row: 1, color: 'black'});
      var stone2 = new Stone({col: 1, row: 2, color: 'black'});
      var stone3 = new Stone({col: 1, row: 3, color: 'black'});
      var stone4 = new Stone({col: 2, row: 3, color: 'black'});
      var group = new StoneGroup(stone1);

      assert.equal(true, group.attach(stone2));
      assert.equal(true, group.attach(stone3));
      assert.equal(true, group.attach(stone4));
    });

  });

  describe('eat()', function () {
   
    it('should copy every other stones', function () {
      var group1 = new StoneGroup({col: 1, row: 1, color: 'black'})
      var group2 = new StoneGroup({col: 2, row: 1, color: 'black'}, {col: 3, row: 1, color: 'black'})

      group1.eat(group2);
      assert.equal(3, group1.size());
      assert.equal(true, group1.contains({col: 2, row: 1, color: 'black'}));
    });

    it('should empty the eaten group', function () {
      var group1 = new StoneGroup({col: 1, row: 1, color: 'black'})
      var group2 = new StoneGroup({col: 2, row: 1, color: 'black'}, {col: 3, row: 1, color: 'black'})

      group1.eat(group2);
      assert.equal(0, group2.size());
    });

  });

});
