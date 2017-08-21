'use strict'

const clone = require('./../lib/clone');

var Tensor = (...args) => {
	let t = {};
	let batchSize = 0;
	let columnSize = 0;
	for (let l in args) {
		t[l] = {};
		for (let j in args[l]) {
			t[l][j] = {};
			for (let i in args[l][j]) {
				t[l][j][i] = args[l][j][i];
			}
			if (args[l][j].length > columnSize) {
				columnSize = args[l][j].length;
			}
		}
		if (args[l].length > batchSize) {
			batchSize = args[l].length;
		}
	}
	t.size = args.length;
	t.batchSize = batchSize;
	t.columnSize = columnSize;
}

module.exports.Tensor = Tensor;

