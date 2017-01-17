
var parseCatFile = function(data, type) {
	var ret = [];
	if (data) {
		if (type === 'tree') {
			data.split('\n').forEach(function(line) {
				if (line && line.length) {
					var parts = line.split(/\s/);
					var info = {
						'name': parts[3],
						'id': parts[2],
						'type': parts[1]
					};
					ret.push(info);
				}
			});
		} else if (type.localeCompare('commit') == 0) {

		} else if (type.localeCompare('blob') == 0) {

		}
	}
	return ret;
}

var Git = function(path) {
	var Promise = require('bluebird');
	var gitSync = require('simple-git')(path);
	var git = Promise.promisifyAll(gitSync);

	git.catFileAsyncOld = git.catFileAsync;
	git.catFileAsync = function(id) {
		var type;
		return git.catFileAsyncOld(['-t', id])
			.then(function(obj_type) {
				type = obj_type.trim();
				return git.catFileAsyncOld(['-p', id]);
			}).then(function(data) {
				return parseCatFile(data, type);
			});
	};

	git.buildTreeAsync = function(object) {
		if (!object || !object.type || object.type !== 'tree' || !object.id)
			return;

		var innerSync = function(obj) {
			var resolve, reject;
			var promise = new Promise(function(res, rej){
				resolve = res;
				reject = rej;
			});

			var tree = {
				'name': obj.name,
				'children': []
			};
			git.catFileAsync(obj.id).then(function(objs) {
				var subtrees = [];
				objs.forEach(function(obj) {
					if (obj.type === 'tree') {
						subtrees.push(obj);
					} else {
						tree.children.push(obj);
					}
				});

				Promise.all(subtrees.map(function(st) {
					return innerSync(st)
						.then(function (result) {
							tree.children.push(result);
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

	return git;
};




module.exports = Git;