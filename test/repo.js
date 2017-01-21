var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var Repo = require('../repo.js');
var repo = new Repo(__dirname + '/..');

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

var first_diff =   { 
    'git.js': [ '-1,8', '+1,14', '-11,80', '+17,101' ],
    'git_util.js': [ '-0,0', '+1,114' ],
    'package.json': [ '-12,6', '+12,14' ],
    'persist.js': [ '-0,0', '+1,30' ],
    'repo.js': [ '-0,0', '+1,157' ],
    'test.js': [ '-1,15', '+1,42' ],
    'test/git.js': [ '-0,0', '+1,39' ],
    'test/git_util.js': [ '-0,0', '+1,17' ],
    'test/persist.js': [ '-0,0', '+1,54' ],
    'test/repo.js': [ '-0,0', '+1,82' ],
    'types.js': [ '-0,0', '+1,17' ] 
};

describe('diffHistory', function() {
    var history;
    it('should generate diff history for 8th commit in this repo', function(done) {
        repo.diffHistory('87de0509018493e8b76ea0853177593942e7e9d4').then(function(result) {
            history = result;
            //console.log(history);
            expect(result).to.have.lengthOf(8);
            done();
        });
    });
    it('should have accurate data for first diff', function() {
        Object.keys(first_diff).forEach(function(file) {
            expect(history[7][file]).to.deep.equal(first_diff[file]);
        });
        Object.keys(history[7]).forEach(function(file) {
            expect(history[7][file]).to.deep.equal(first_diff[file]);
        });
    });
});

describe('fileSizeHistory', function() {
    var history;
    it('should generate file size history for 8th commit in this repo', function(done) {
        repo.fileSizeHistory('87de0509018493e8b76ea0853177593942e7e9d4').then(function(result) {
            history = result;
            //console.log(history);
            expect(result).to.have.lengthOf(8);
        	done();
        });
    });
    it('should have accurate data for first commit', function() {
        Object.keys(first_commit).forEach(function(file) {
            expect(history[7].tree[file]).to.equal(first_commit[file]);
        });
        Object.keys(history[7].tree).forEach(function(file) {
            expect(history[7].tree[file]).to.equal(first_commit[file]);
        });
    });
    it('should have accurate data for eighth commit', function() {
        Object.keys(first_commit).forEach(function(file) {
            expect(history[0].tree[file]).to.equal(eighth_commit[file]);
        });
        Object.keys(history[0].tree).forEach(function(file) {
            expect(history[0].tree[file]).to.equal(eighth_commit[file]);
        });
    });
});