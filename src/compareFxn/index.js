/**
 * 
 * @param {string} item1 - item to compare.Can be string or number
 * @param {string} condition - condition for comparism
 * @param {string} item2 - item to compare.Can be string or number
 */
module.exports = function compareItems (item1, condition, item2, ) {
    if(typeof item1 === 'string') item1 = item1.normalize()

    if(typeof item2 === 'string') item2 = item2.normalize()
    
    if(condition === 'eq' || condition === '==='){
        if(item1 === item2)
            return true
            return false
    }

    if(condition === 'neq' || condition === '!=='){
        if(item1 !== item2)
            return true 
            return false
        
    }

    if(condition === 'gt' || condition === '>'){
        if(item1 > item2)
            return true
            return false
    }
    
    if(condition === 'gte' || condition === '>='){
        if(item1 >= item2)
        return true
        return false
    }
}