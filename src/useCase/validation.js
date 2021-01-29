const { validationFxn } = require('../validation')

/**
 * This design pattern enables this api to be easily scalable
 * This allows for other service integratiion/dependencies
 */
module.exports = function buildValidatiion () {
    return function makeValidation (payload) {
        const validated = validationFxn(payload)
        validated.checkValidation()
        return {
            message: validated.getMessage,
            status: validated.getStatus,
            data: validated.getRetData
        }
    }
}