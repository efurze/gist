var Git = require('./git.js')('/Users/efurze/repos/SearchBuzz-Grid');

/*
Git.catFileAsync('master^{tree}').then(function(data){
	console.log(data);
});
*/

Git.buildTreeAsync({
	id: 'b7744f2b162795f093b7304ac259062aba24cb75',
	name: 'root',
	type: 'tree'
}).then(function(data) {
	console.log(JSON.stringify(data));
});