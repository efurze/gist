'use strict';

var Promise = require('bluebird');
var fs = require('fs');
require('./types.js');

Promise.promisifyAll(fs);

var DATA_DIR = './persist';

var FILESIZE_FILE = DATA_DIR + '/filesizehistory.json';

var Persist = function() {

};

Persist.prototype.saveFileSizeHistory = function(history) {
	return fs.writeFileAsync(FILESIZE_FILE, JSON.stringify(history));
};

Persist.prototype.getFileSizeHistory = function() {
	return fs.readFileAsync(FILESIZE_FILE)
		.then(function(data) {
			return JSON.parse(data);
		});
};

module.exports = Persist;