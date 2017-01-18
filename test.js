var Git = require('./git.js')('/Users/efurze/repos/SearchBuzz-Grid');
var util = require('./git_util.js');
var Util = new util(Git);

/*
Git.catFileAsync('master').then(function(data){
	console.log(data);
});
*/

Util.revWalk('master').then(function(msgs) {
	console.log(msgs);
})



/*
Util.buildTreeAsync({
	id: 'b7744f2b162795f093b7304ac259062aba24cb75',
	name: 'root',
	type: 'tree'
}).then(function(data) {
	//console.log(JSON.stringify(data));
	console.log(Util.enumerateFiles(data, ""));
});
*/
/*
Git.diffAsync(['ae951200e7fce627737cbad324939b9306dc2183',
	'c1f945367365a0d2672683d2971f962fb43b18c6']).then(function(data) {
	console.log(data);
});
*/