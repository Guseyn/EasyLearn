'use strict'

const clone = require('./../lib/clone');
const tensorModule = require('./tensor');

const Tensor = tensorModule.Tensor;

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

var MatrixAsSumOfTwoMatrices = (matrix1, matrix2) => {
	let m = {};
	let size = Math.max(matrix1.size, matrix2.size);
	let columnSize = Math.max(matrix1.columnSize, matrix2.columnSize);
	for (let j = 0; j < size; j++) {
		m[j] = {};
		for (let i = 0; i < columnSize; i++) {
			m[j][i] = (matrix1[j] ? (matrix1[j][i] || 0) : 0) 
						+ (matrix2[j] ? (matrix2[j][i] || 0) : 0);
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

var MatrixAsProductOfTwoMatrices = (matrix1, matrix2) => {
	let m = {};
	if (matrix1.columnSize !== matrix2.size) {
		throw new Error('number of the columns of the first matrix must be equal to the number of the rows of the second matrix');
	}
	for (let j = 0; j < matrix1.size; j++) {
		m[j] = {};
		for (let i = 0; i < matrix2.columnSize; i++) {
			m[j][i] = 0;
			for (let k = 0; k < matrix1.columnSize; k++) {
				m[j][i] += (matrix1[j] ? (matrix1[j][k] || 0) : 0)
							 * (matrix2[k] ? (matrix2[k][i] || 0) : 0);
			}
		}
	}
	m.size = matrix2.columnSize;
	m.columnSize = matrix1.size;
	return m;
}

var MatrixAsHadamardProduct = (matrix1, matrix2) => {
	let m = {};
	let size = Math.max(matrix1.size, matrix2.size);
	let columnSize = Math.max(matrix1.columnSize, matrix2.columnSize);
	for (let j = 0; j < size; j++) {
		m[j] = {};
		for (let i = 0; i < columnSize; i++) {
			m[j][i] = (matrix1[j] ? (matrix1[j][i] || 0) : 0) 
						* (matrix2[j] ? (matrix2[j][i] || 0) : 0);
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
		if (matrix.size === 1) {
			return matrix[0][0];
		}
		if (matrix.size === 2) {
			return matrix[0][0] * matrix[1][1] 
						- matrix[0][1] * matrix[1][0];
		}
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
	throw new Error('det can be calculated only for square matrices');
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

var MatrixFromTensor = (tensor, l) => {
	let m = {};
	for (let j = 0; j < tensor[l].size; j++) {
		m[j] = {};
		for (let i = 0; i < tensor[l].columnSize; i++) {
			m[j][i] = tensor[l][j][i] || 0;
		}
	}
	m.size = tensor[l].size;
	m.columnSize = tensor[l].columnSize;
	return m;
}

var MatrixAsMatrixWithSwitchedRows = (matrix, rowNum1, rowNum2) => {
	let m = {};
	for (let j = 0; j < matrix.size; j++) {
		m[j] = {};
		for (let i = 0; i < matrix.columnSize; i++) {
			if (j === rowNum1) {
				m[j][i] = matrix[j] ? (matrix[rowNum2][i] || 0) : 0;
			} else if (j === rowNum2) {
				m[j][i] = matrix[j] ? (matrix[rowNum1][i] || 0) : 0;
			} else {
				m[j][i] = matrix[j] ? (matrix[j][i] || 0) : 0;
			}
		}
	}
	m.size = matrix.size;
	m.columnSize = matrix.columnSize;
	return m;
}

var MatrixAsMatrixWithSwitchedColumns = (matrix, columnNum1, columnNum2) => {
	let m = {};
	for (let j = 0; j < matrix.size; j++) {
		m[j] = {};
		for (let i = 0; i < matrix.columnSize; i++) {
			if (i === columnNum1) {
				m[j][i] = matrix[j] ? (matrix[j][columnNum2] || 0) : 0;
			} else if (i === columnNum2) {
				m[j][i] = matrix[j] ? (matrix[j][columnNum1] || 0) : 0;
			} else {
				m[j][i] = matrix[j] ? (matrix[j][i] || 0) : 0;
			}
		}
	}
	m.size = matrix.size;
	m.columnSize = matrix.columnSize;
	return m;
}

var MatrixAsMatrixWithSwitchedRowsAndColums = (matrix, rowNum1, rowNum2, columnNum1, columnNum2) => {
	let m = {};
	for (let j = 0; j < matrix.size; j++) {
		m[j] = {};
		for (let i = 0; i < matrix.columnSize; i++) {
			if (j === rowNum1) {
				if (i === columnNum1) {
					m[j][i] = matrix[j] ? (matrix[rowNum2][columnNum2] || 0) : 0;
				} else if (i === columnNum2) {
					m[j][i] = matrix[j] ? (matrix[rowNum2][columnNum1] || 0) : 0;
				} else {
					m[j][i] = matrix[j] ? (matrix[rowNum2][i] || 0) : 0;
				}
			} else if (j === rowNum2) {
				if (i === columnNum1) {
					m[j][i] = matrix[j] ? (matrix[rowNum1][columnNum2] || 0) : 0;
				} else if (i === columnNum2) {
					m[j][i] = matrix[j] ? (matrix[rowNum1][columnNum1] || 0) : 0;
				} else {
					m[j][i] = matrix[j] ? (matrix[rowNum1][i] || 0) : 0;	
				}
			} else {
				if (i === columnNum1) {
					m[j][i] = matrix[j] ? (matrix[j][columnNum2] || 0) : 0;
				} else if (i === columnNum2) {
					m[j][i] = matrix[j] ? (matrix[j][columnNum1] || 0) : 0;
				} else {
					m[j][i] = matrix[j] ? (matrix[j][i] || 0) : 0;
				}
			}
		}
	}
	m.size = matrix.size;
	m.columnSize = matrix.columnSize;
	return m;
}

var MatrixAsMatrixWithRowMultipliedWithScalar = (matrix, rowNum, scalar) => {
	let m = {};
	for (let j = 0; j < matrix.size; j++) {
		m[j] = {};
		for (let i = 0; i < matrix.columnSize; i++) {
			if (j === rowNum) {
				m[j][i] = matrix[j] ? (matrix[j][i] * scalar || 0) : 0;
			} else {
				m[j][i] = matrix[j] ? (matrix[j][i] || 0) : 0;
			}
		}
	}
	m.size = matrix.size;
	m.columnSize = matrix.columnSize;
	return m;
}

var MatrixAsMatrixWithColumnMultipliedWithScalar = (matrix, columnNum, scalar) => {
	let m = {};
	for (let j = 0; j < matrix.size; j++) {
		m[j] = {};
		for (let i = 0; i < matrix.columnSize; i++) {
			if (i === columnNum) {
				m[j][i] = matrix[j] ? (matrix[j][i] * scalar || 0) : 0;
			} else {
				m[j][i] = matrix[j] ? (matrix[j][i] || 0) : 0;
			}
		}
	}
	m.size = matrix.size;
	m.columnSize = matrix.columnSize;
	return m;
}

var MatrixAsMatrixWithRowAddedToAnotherRow = (matrix, rowNum1, rowNum2) => {
	let m = {};
	for (let j = 0; j < matrix.size; j++) {
		m[j] = {};
		for (let i = 0; i < matrix.columnSize; i++) {
			if (j === rowNum1) {
				m[j][i] = matrix[j] ? ((matrix[rowNum1][i] || 0) + (matrix[rowNum2][i] || 0)) : 0;
			} else {
				m[j][i] = matrix[j] ? (matrix[j][i] || 0) : 0;
			}
		}
	}
	m.size = matrix.size;
	m.columnSize = matrix.columnSize;
	return m;
}

var MatrixAsMatrixWithColumnAddedToAnotherColumn = (matrix, columnNum1, columnNum2) => {
	let m = {};
	for (let j = 0; j < matrix.size; j++) {
		m[j] = {};
		for (let i = 0; i < matrix.columnSize; i++) {
			if (i === columnNum1) {
				m[j][i] = matrix[j] ? ((matrix[j][columnNum1] || 0) + (matrix[j][columnNum2] || 0)) : 0;
			} else {
				m[j][i] = matrix[j] ? (matrix[j][i] || 0) : 0;
			}
		}
	}
	m.size = matrix.size;
	m.columnSize = matrix.columnSize;
	return m;
}

/*
	invoke without rowCount and columnCount
	with hard mode as true it has more chances to get rid of zero at the position, but it requires more resources
	not recommended for using in common case: it's not effective, but simple
	better look at MatrixAsMatrixWithoutZeroAtCertainPositionBySmartSwitch
*/
var MatrixAsMatrixWithoutZeroAtCertainPositionBySillySwitchingRowsAndColumns = (matrix, j, i, hardMode, rowCount, columnCount) => {
	if (matrix[j][i] === 0) {
		hardMode = hardMode || false;
		rowCount = rowCount || 0;
		columnCount = columnCount || 0;
		if (j === rowCount) {
			rowCount += 1;
		} else if (i === columnCount) {
			columnCount += 1;
		}
		if (rowCount < matrix.size) {
			return MatrixAsMatrixWithoutZeroAtCertainPositionBySillySwitchingRowsAndColumns(
				hardMode
					? (matrix[rowCount][i] === 0
						? matrix
						: MatrixAsMatrixWithSwitchedRows(
							matrix, j, rowCount
						))
					: MatrixAsMatrixWithSwitchedRows(
						matrix, j, rowCount
					),
				j, i, hardMode, rowCount + 1, columnCount
			);
		} else if (columnCount < matrix.columnSize) {
			return MatrixAsMatrixWithoutZeroAtCertainPositionBySillySwitchingRowsAndColumns(
				hardMode ? 
					(matrix[j][columnCount] === 0 
						? matrix
						: MatrixAsMatrixWithSwitchedColumns(
							matrix, i, columnCount
						)
					)
					: MatrixAsMatrixWithSwitchedColumns(
						matrix, i, columnCount
					),
				j, i, hardMode, rowCount, columnCount + 1
			);
		} else {
			throw new Error(`could not get rid of zero in matrix at position: {${j}, ${i}}`);
		}
	} else {
		return matrix;
	}
}

var PositionOfFirstNonZeroElementInMatrix = () => {
	let pos = {
		j: 0,
		i: 0
	};
}

var matrix = Matrix([1,2,3,4],[5,6,7,8],[9,10,11,12]);

module.exports.Matrix = Matrix;
module.exports.TransposedMatrix = TransposedMatrix;
module.exports.MatrixAsSumOfTwoMatrices = MatrixAsSumOfTwoMatrices;
module.exports.MatrixAsProductOfMatrixAndScalar = MatrixAsProductOfMatrixAndScalar;
module.exports.MatrixAsProductOfTwoMatrices = MatrixAsProductOfTwoMatrices;
module.exports.MatrixAsHadamardProduct = MatrixAsHadamardProduct;
module.exports.IdentityMatrix = IdentityMatrix;
module.exports.MatrixFrobeniusNorm = MatrixFrobeniusNorm;
module.exports.DeterminantOfMatrix = DeterminantOfMatrix;
module.exports.MatrixTrace = MatrixTrace;
module.exports.MatrixFromTensor = MatrixFromTensor;

