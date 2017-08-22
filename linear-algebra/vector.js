'use strict'

const clone = require('./../lib/clone');

const matrixModule = require('./matrix');
const Matrix = matrixModule.Matrix;

var Vector = (...args) => {
	let v = {};
	for (let i in args) {
		v[i] = args[i];
	}
	v.size = args.length;
	return v;
}

var VectorWithNewElm = (vector, elm) => {
	let v = clone.NumObject(vector);
	v[v.size] = elm;
	v.size += 1;
	return v;
}

var VectorAsSumOfTwoVectors = (v1, v2) => {
	let v = {};
	let size = Math.max(v1.size, v2.size);
	for (let i = 0; i < size; i++) {
		v[i] = (v1[i] || 0) + (v2[i] || 0);
	}
	v.size = size;
	return v;
}

var VectorAsProductOfVectorAndScalar = (vector, scalar) => {
	let v = {};
	for (let i = 0; i < vector.size; i++) {
		v[i] = vector[i] * scalar;
	}
	return v;
}

var ScalarProduct = (v1, v2) => {
	let res = 0;
	let size = Math.max(v1.size, v2.size);
	for (let i = 0; i < size; i++) {
		res += (v1[i] || 0) * (v2[i] || 0);
	}
	return res;
}

var VectorAsProductOfMatrixAndVector = (matrix, vector) => {
	let v = {};
	let size = 0;
	for (let j = 0; j < matrix.size; j++) {
		let row = matrix[j];
		let value = 0;
		for (let i = 0; i < matrix.columnSize; i++) {
			value += row[i] * (vector[i] || 0);
		}
		if (row.size > size) {
			size = row.size;
		}
		v[j] = value;
	}
	v.size = size;
	return v;
}

var VectorAsDotProduct = (v1, v2) => {
	let v = {};
	let size = Math.max(v1.size, v2.size);
	for (let i = 0; i < size; i++) {
		v[i] = (v1[i] || 0) * (v2[i] || 0);
	}
	v.size = size;
	return v;
}

var L1VectorNorm = (vector) => {
	let norm = 0;
	for (let i = 0; i < vector.size; i++) {
		norm += Math.abs(vector[i]);
	}
	return norm;
}

var MaxVectorNorm = (vector) => {
	let norm = 0;
	for (let i = 0; i < vector.size; i++) {
		if (vector[i] > norm) {
			norm = vector[i];
		}
	}
	return norm;
}

module.exports.Vector = Vector;
module.exports.VectorWithNewElm = VectorWithNewElm;
module.exports.VectorAsSumOfTwoVectors = VectorAsSumOfTwoVectors;
module.exports.VectorAsProductOfVectorAndScalar = VectorAsProductOfVectorAndScalar;
module.exports.ScalarProduct = ScalarProduct;
module.exports.VectorAsProductOfMatrixAndVector = VectorAsProductOfMatrixAndVector;
module.exports.VectorAsDotProduct = VectorAsDotProduct;
module.exports.L1VectorNorm = L1VectorNorm;
module.exports.MaxVectorNorm = MaxVectorNorm;

