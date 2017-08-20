'use strict'

const clone = require('./../lib/clone');

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

let v = Vector(1, 2, 3);
let nv = VectorWithNewElm(v, 4);
let sv = VectorAsSumOfTwoVectors(v, nv);
let spvv = VectorAsProductOfVectorAndScalar(sv, 2);
let sp = ScalarProduct(nv, sv);

console.log(sp);
console.log(spvv);
console.log(sv);
console.log(nv);
console.log(v);

module.exports.Vector = Vector;
module.exports.VectorWithNewElm = VectorWithNewElm;
module.exports.VectorAsSumOfTwoVectors = VectorAsSumOfTwoVectors;
module.exports.VectorAsProductOfVectorAndScalar = VectorAsProductOfVectorAndScalar;
module.exports.ScalarProduct = ScalarProduct;

