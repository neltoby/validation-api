/**
 * 
 * @param {object} obj 
 * @param {string} prop 
 * @return boolean
 */
module.exports = function objectCheck(obj, prop){
    if(obj.constructor !== Object){
        throw {
            message: `Object of type Object expected, ${obj !== null ? typeof obj : null}  given`
        }
    }
    if(Object.keys(obj).includes(prop))
        return true
        return false
}