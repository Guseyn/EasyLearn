'use strict'

var is = {
    
    real: (obj) => {
        return typeof obj !== 'undefined';  
    },
    
    notNull: (obj) => {
        return obj !== null
    },
    
    object: (obj) => {
      return typeof obj === 'object';  
    },
    
    function: (func) => {
        return typeof func === 'function';
    },
    
    string: (str) => {
        return typeof str === 'string';
    },
    
    number: (numb) => {
        return typeof numb === 'number';
    },
    
    boolean: (b) => {
        return typeof b === 'boolean';
    },
    
    array: (arr) => {
        return Array.isArray(arr);
    }
}

module.exports = is;