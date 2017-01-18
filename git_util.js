var Promise = require('bluebird');

var Util = function (git) {
	this.git = git;
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

Util.prototype.buildTreeAsync = function(object) {
	if (!object || !object.type || object.type !== 'tree' || !object.id)
		return;

	var self = this;

	var innerSync = function(obj) {
		var resolve, reject;
		var promise = new Promise(function(res, rej){
			resolve = res;
			reject = rej;
		});

		var tree = new Node(obj.name);

		self.git.catFileAsync(obj.id).then(function(objs) {
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


var Node = function(name) {
	this.name = name;
	this.children = null;
};

Node.prototype.addChild = function(child) {
	if (!this.children) {
		this.children = [];
	}
	this.children.push(child);
};

module.exports = Util;