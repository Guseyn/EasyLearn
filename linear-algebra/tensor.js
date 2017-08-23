'use strict'

const clone = require('./../lib/clone');
const util = require('util');

var Tensor = (...args) => {
	let t = {};
	for (let l in args) {
		t[l] = {};
		let columnSize = 0;
		for (let j in args[l]) {
			t[l][j] = {};
			for (let i in args[l][j]) {
				t[l][j][i] = args[l][j][i];
			}
			if (args[l][j].length > columnSize) {
				columnSize = args[l][j].length;
			}
		}
		t[l].columnSize = columnSize;
		t[l].size = args[l].length
	}
	t.size = args.length;
	return t;
}

module.exports.Tensor = Tensor;

