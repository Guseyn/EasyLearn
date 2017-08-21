'use strict'

const clone = require('./../lib/clone');

var Matrix = (...args) => {
	let m = {};
	let columnSize = 0;
	for (let j in args) {
		m[j] = {};
		for (let i in args[j]) {
			m[j][i] = args[j][i];
		}
		if (args[j].length > columnSize) {
			columnSize = args[j].length;
		}
	}
	m.columnSize = columnSize;
	m.size = args.length;
	return m;
}

var TransposedMatrix = (matrix) => {
	let m = {};
	for (let j = 0; j < matrix.columnSize; j++) {
		m[j] = {};
		for (let i = 0; i < matrix.size; i++) {
			m[j][i] = matrix[i][j] || 0;
		}
	}
	m.columnSize = matrix.size;
	m.size = matrix.columnSize;
	return m;
}

var MatrixAsSumOfTwoMatrix = (m1, m2) => {
	let m = {};
	let size = Math.max(m1.size, m2.size);
	let columnSize = Math.max(m1.columnSize, m2.columnSize);
	for (let j = 0; j < size; j++) {
		m[j] = {};
		for (let i = 0; i < columnSize; i++) {
			m[j][i] = (m1[j] ? (m1[j][i] || 0) : 0) 
						+ (m2[j] ? (m2[j][i] || 0) : 0);
		}
	}
	m.size = size;
	m.columnSize = columnSize;
	return m;
}

var MatrixAsProductOfMatrixAndScalar = (matrix, scalar) => {
	let m = {};
	for (let j = 0; j < matrix.size; j++) {
		m[j] = {};
		for (let i = 0; i < matrix.columnSize; i++) {
			m[j][i] = matrix[j][i] * scalar;
		}
	}
	m.size = matrix.size;
	m.columnSize = matrix.columnSize;
	return m;
}

var MatrixAsHadamardProduct = (m1, m2) => {
	let m = {};
	let size = Math.max(m1.size, m2.size);
	let columnSize = Math.max(m1.columnSize, m2.columnSize);
	for (let j = 0; j < size; j++) {
		m[j] = {};
		for (let i = 0; i < columnSize; i++) {
			m[j][i] = (m1[j] ? (m1[j][i] || 0) : 0) 
						* (m2[j] ? (m2[j][i] || 0) : 0);
		}
	}
	m.size = size;
	m.columnSize = columnSize;
	return m;
}

module.exports.Matrix = Matrix;
module.exports.TransposedMatrix = TransposedMatrix;
module.exports.MatrixAsSumOfTwoMatrix = MatrixAsSumOfTwoMatrix;
module.exports.MatrixAsProductOfMatrixAndScalar = MatrixAsProductOfMatrixAndScalar;


