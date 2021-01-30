const makeValidation = require('./validation');
const arrayCheck = require('../arrayCheck');
const objCheck = require('../objCheck');
const compareItems = require('../compareFxn');

const validationFxn = makeValidation({arrayCheck, objCheck, compareItems})

module.exports = Object.freeze({ validationFxn })