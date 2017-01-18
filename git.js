
var parseCatFile = function(data, type) {
	var ret;
	if (data) {
		if (type === 'tree') {
			ret = [];
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
		} else if (type === 'commit') {
			ret = {};
			var parents = [];
			data.split('\n').forEach(function(line) {
				if (line && line.length) {
					var parts = line.split(/\s/);
					if (parts[0].trim() === 'tree') {
						ret['tree'] = parts[1];
					} else if (parts[0].trim() === 'author') {
						ret['author'] = parts[1];
					} else if (parts[0].trim() === 'committer') {
						ret['committer'] = parts[1];
					} else if (parts[0].trim() === 'parent') {
						parents.push(parts[1]);
					}
				}
			});
			ret['parents'] = parents;
		} else if (type === 'blob') {
			ret = data.split('\n');
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

	


	return git;
};




module.exports = Git;