const colors = require('colors');
const client = require('../package.json');
const icebear = require('../node_modules/peerio-icebear/package.json');

let hasError = false;

for (let p in icebear.dependencies) {
	const clientP = client.dependencies[p];
	const icebearP = icebear.dependencies[p];
	if(clientP !== icebearP) {
		hasError = true;
		console.error(`ERR: peerio-icebear ${p} dependency mismatch - wants ${icebearP}, got ${clientP}`.red);
	}
}

if (hasError) {
	process.exit(1);
} else {
	console.log(`peerio-icebear dependency check: OK [passed]`.green);
}

