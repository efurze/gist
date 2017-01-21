var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var Repo = require('../repo.js');
var repo = new Repo(__dirname + '/..');
var Persist = require('../persist.js');
var persist = new Persist();

var first_commit = { 
    'git.js': 90, 
    'package.json': 18, 
    'test.js': 15 
};
var eighth_commit = { 
    'git.js': 85,
    'package.json': 26,
    'test.js': 36,
    'git_util.js': 130,
    'repo.js': 118,
    'types.js': 14,
    'test/git.js': 29 
};

describe('saveFileSizeHistory', function() {
	var loadedHistory;
	it('should save and load fileSizeHistory', function(done) {
		repo.fileSizeHistory('87de0509018493e8b76ea0853177593942e7e9d4').then(function(result) {
			persist.saveFileSizeHistory('unittest', result)
				.then(function() {
					return persist.getFileSizeHistory('unittest');
				}).then(function(result) {
					loadedHistory = result;
					expect(loadedHistory).to.have.lengthOf(8);
					done();
				});
		});	
	});
	it('should have accurate data for first commit', function() {
        Object.keys(first_commit).forEach(function(file) {
            expect(loadedHistory[7].tree[file]).to.equal(first_commit[file]);
        });
        Object.keys(loadedHistory[7].tree).forEach(function(file) {
            expect(loadedHistory[7].tree[file]).to.equal(first_commit[file]);
        });
    });
    it('should have accurate data for eighth commit', function() {
        Object.keys(first_commit).forEach(function(file) {
            expect(loadedHistory[0].tree[file]).to.equal(eighth_commit[file]);
        });
        Object.keys(loadedHistory[0].tree).forEach(function(file) {
            expect(loadedHistory[0].tree[file]).to.equal(eighth_commit[file]);
        });
    });
});