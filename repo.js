'use strict'
var fs = require('fs');
var Promise = require('bluebird');
var Types = require('./types.js');
var Util = require('./git_util.js');
var git = require('./git.js');

var Repo = function(path) {
	this._git = new git(path);
	this._util = new Util(this._git);
};

Repo.prototype.init = function() {
	var self = this;
	return self._util.revWalk('master')
		.then(function(history) { // array of commits
			
			return Promise.mapSeries(history, function(rev) {
				return self._util.buildTree(history[1].tree)
					.then(getAllFileIds)
					.then(function(files){
						return Promise.each(Object.keys(files), function(filepath) {
							return self._git.catFile(files[filepath])
								.then(function(filedata) {
									files[filepath] = filedata.length;
								});
						}).then(function() {
							return files;
						});
					});
			});
		});
};


//=========================================

/*
	returns: {
		'foo': <SHA-1>,
		'bar/foo': <SHA-1>, ...
	}
*/
var getAllFileIds = function(tree, path) {
	var self = this;
	var files = {};
	if (path && path.length) {
		path += "/";
	} else {
		path = "";
	}

	tree.children.forEach(function(child) {
		if (child instanceof Node) {
			var subtree = getAllFileIds(child, child.name);
			Object.keys(subtree).forEach(function(filename) {
				files[filename] = subtree[filename];
			});
		} else {
			files[path + child.name] = child.id;
		}
	});

	return files;
};

module.exports = Repo;