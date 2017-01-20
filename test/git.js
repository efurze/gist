var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var Git = require('../git.js');
var git = new Git(__dirname + '/..');

describe('diff test', function() {
  it('should diff 2 revisions', function(done) {
    git.diff('906c10186f2efbe3d7eaad7743007905f7c51eee',
        '838ed5a87fff06d6d985d221dcd9f8ecc9817bb7').then(function(result) {
        console.log(JSON.stringify(result));
        done();
    });
  });
});

describe('catFile test', function() {
  it('should cat the current commit object', function(done) {
    git.catFile('48ee4d0ec147b2a44ef8e4d20d20d2a3f9fe48ad').then(function(result) {
    	console.log(result);
      expect(result).to.have.property('id');
    	expect(result).to.have.property('tree');
    	expect(result).to.have.property('author');
    	expect(result).to.have.property('committer');
    	expect(result).to.have.property('parents');
    	expect(result).to.have.property('commit_msg');
    	done();
    });
  });

describe('revList test', function() {
  it('should list revision history', function(done) {
    git.revList('74b600444f909f52563bade5ead0eec52638260e').then(function(result) {
        console.log(result);
        done();
    });
  });
});
});