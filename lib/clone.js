'use strict'

module.exports.Array = (array) => {
	return array.slice();
}

module.exports.NumObject = (numObject) => {
	return Object.assign({}, numObject);
}
