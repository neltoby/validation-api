const buildValidatiion = require('./validation');

const makeValidation = buildValidatiion() // dependencies can be injected here

module.exports = Object.freeze({ makeValidation })