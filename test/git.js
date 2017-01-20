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
    git.catFile('master').then(function(result) {
    	console.log(result);
    	expect(result).to.have.property('tree');
    	expect(result).to.have.property('author');
    	expect(result).to.have.property('committer');
    	expect(result).to.have.property('parents');
    	expect(result).to.have.property('commit_msg');
    	done();
    });
  });
});