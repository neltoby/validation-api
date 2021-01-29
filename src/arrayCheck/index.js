/**
 * 
 * @param {array} arr 
 * @param {string} val 
 * @return boolean
 */
module.exports = function arrayCheck(arr, val) {
    if(!Array.isArray(arr)){
        throw {
            message: `Object of type array expected, ${typeof arr} given`
        }
    }
    if(arr.includes(val))
        return true
        return false
}