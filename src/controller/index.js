const makeValidationController = require('./validation');
const { makeValidation } = require('../useCase');

const validationController = makeValidationController({ makeValidation })

module.exports = Object.freeze({
    validationController
})