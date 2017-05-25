/* eslint-disable */
const madge = require('madge');

madge('app/components/App.js').then((res) => {
	res.circular().forEach(s => console.log(s));
});
