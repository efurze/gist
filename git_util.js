var Promise = require('bluebird');
var Types = require('./types.js');

var Util = function (git) {
	this.git = git;
};

/*
	returns [
		 { 	tree: 'f71cb44149ff818bed7e835460bdd284dcdf0641',
		    author: 'Prasanna',
		    committer: 'Prasanna',
		    parents: [],
		    commit_msg: 'Initial commit' 
		 },
	]

	Oldest revision first
*/
Util.prototype._doRevWalk = function(commit) {
	if (!commit) {
		return [];
	}
	var self = this;
	var msgs = [];
	msgs.push(commit);
	if (commit.parents.length) {
		return self.git.catFile(commit.parents[0])
			.then(function(c) {
				return self._doRevWalk.apply(self, [c]);
			}).then(function(m){
				return m.concat(msgs);
			});
	} else {
		return msgs;
	}
};

Util.prototype.revWalk = function (branch_name) { 
	var self = this;
	if (typeof(branch_name) === 'string') {
		return this.git.catFile(branch_name)
			.then(function(commit) {
				return self._doRevWalk.apply(self, [commit]);
			});
	}
};

Util.prototype.enumerateFiles = function(tree, path) {
	var self = this;
	var files = [];
	if (path && path.length) {
		path += "/";
	} else {
		path = "";
	}

	tree.children.forEach(function(child) {
		if (child instanceof Node) {
			var subtree = self.enumerateFiles(child, child.name);
			files = files.concat(subtree);
		} else {
			files.push(path + child.name);
		}
	});

	return files;
};

/* returns tree node: 
	{
		name: <str>,
		children: [{
			name:,
			id: SHA-1
			type: tree | blob
		}]
	}
*/
Util.prototype.buildTree = function(object) {
	if (typeof(object) == 'string') {
		object = {
			id: object,
			name: "",
			type: "tree"
		};
	} else if (!object || !object.type || object.type !== 'tree' || !object.id)
		return;

	var self = this;

	var innerSync = function(obj) {
		var resolve, reject;
		var promise = new Promise(function(res, rej){
			resolve = res;
			reject = rej;
		});

		var tree = new Node(obj.name);

		self.git.catFile(obj.id).then(function(objs) {
			var subtrees = [];
			objs.forEach(function(obj) {
				if (obj.type === 'tree') {
					subtrees.push(obj);
				} else {
					tree.addChild(obj);
				}
			});

			Promise.all(subtrees.map(function(st) {
				return innerSync(st)
					.then(function (result) {
						tree.addChild(result);
					});
			})).then(function() {
				resolve(tree);
			});
		}).catch(function(err) {
			reject(err);
		});
		return promise;
	};
	return innerSync(object);
};




module.exports = Util;