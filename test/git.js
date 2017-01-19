var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var Git = require('../git.js');
var git = new Git('/Users/efurze/repos/gist');

describe('catFile', function() {
  it('should cat the current commit object', function(done) {
    git.catFile('master').then(function(result) {
    	assert.typeOf(result, 'object');
    	expect(result).to.have.property('tree');
    	expect(result).to.have.property('author');
    	expect(result).to.have.property('committer');
    	expect(result).to.have.property('parents');
    	expect(result).to.have.property('commit_msg');
    	done();
    });
  });
});