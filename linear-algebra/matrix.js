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

var IdentityMatrix = (size, columnSize) => {
	let im = {};
	for (let j = 0; j < size; j++) {
		im[j] = {};
		for (let i = 0; i < columnSize; i++) {
			im[j][i] = i === j ? 1 : 0;
		}
	}
	im.size = size;
	im.columnSize = columnSize;
	return im;
}

var MatrixFrobeniusNorm = (matrix) => {
	let norm = 0;
	for (let j = 0; j < matrix.size; j++) {
		for (let i = 0; i < matrix.columnSize; i++) {
			norm += Math.pow(matrix[j][i], 2);
		}
	}
	return norm;
}

var DeterminantOfMatrix = (matrix) => {
	if (matrix.size === matrix.columnSize) {
		let det = 0;
		if (matrix.size === 2) {
			return matrix[0][0] * matrix[1][1] 
						- matrix[0][1] * matrix[1][0];
		} else {
			for (let i = 0; i < matrix.size; i++) {
				let M = DeterminantOfMatrix(
							MatrixAsMatrixWithoutRowAndColumn(
								matrix, 0, i
							)
						);
				det += Math.pow(-1, i) * matrix[0][i] * M;
			}
			return det;
		}
	}
}

/*
	private
*/
var MatrixAsMatrixWithoutRowAndColumn = (matrix, j, i) => {
	let m = {};
	for (let mj = 0, jc = 0; mj < matrix.size; mj++) {
		if (mj !== j) {
			m[jc] = {};
			for (let mi = 0, ic = 0; mi < matrix.columnSize; mi++) {
				if (mi !== i) {
					m[jc][ic] = matrix[mj][mi] || 0;
					ic += 1;
				}
			}
			jc += 1;
		}
	}
	m.size = matrix.size - 1;
	m.columnSize = matrix.columnSize - 1;
	return m;
}

var MatrixTrace = (matrix) => {
	let trace = 0;
	for (let j = 0; j < matrix.size; j++) {
		for (let i = 0; i < matrix.columnSize; i++) {
			if (j === i) {
				trace += matrix[j][i];
			}
		}
	}
	return trace;
}

module.exports.Matrix = Matrix;
module.exports.TransposedMatrix = TransposedMatrix;
module.exports.MatrixAsSumOfTwoMatrix = MatrixAsSumOfTwoMatrix;
module.exports.MatrixAsProductOfMatrixAndScalar = MatrixAsProductOfMatrixAndScalar;
module.exports.MatrixAsHadamardProduct = MatrixAsHadamardProduct;
module.exports.IdentityMatrix = IdentityMatrix;
module.exports.MatrixFrobeniusNorm = MatrixFrobeniusNorm;
module.exports.DeterminantOfMatrix = DeterminantOfMatrix;
module.exports.MatrixTrace = MatrixTrace;


