/**
 * An object factory that enables dependency injection (when there is) without
 * having to require. This is the entity of this application. 
 * Every thing else depends on it, so there are no imports/require here.
 * 
 * @param {object}
 * @return {function}
 */

module.exports = function makeValidation ({arrayCheck, objCheck, compareItems}) {
    return function validationFxn (payload) {
        const statusCode = 400;
        const condition = {
            eq: '===',
            neq: '!==',
            gte: '>=',
            gt: '>',
            contains: 'contains'
        }
        class Validation {
            constructor(payload) {
                let newPayload 
                try{
                    newPayload = eval(payload)
                }catch (e){
                    throw {
                        message: {
                            message: "Invalid JSON payload passed.",
                            status: "error",
                            data: null
                        },
                        statusCode
                    }
                }
                const { rule, data} = newPayload
                
                if(!rule) {
                    throw {
                        message: {
                            message: "rule is required.",
                            status: "error",
                            data: null
                        },
                        statusCode
                    }
                }

                if(rule.constructor !== Object) {
                    throw {
                        message: {
                            message: "rule should be an object.",
                            status: "error",
                            data: null
                        },
                        statusCode
                    }
                }
                
                if(!data) {
                    throw {
                        message: {
                            message: "data is required.",
                            status: "error",
                            data: null
                        },
                        statusCode
                    }
                }

                if(data.constructor === Object) {
                    this.dataType = 'object'
                }
                else{
                    if(Array.isArray(data)){
                        this.dataType = 'array'
                    }else if(typeof data === 'string') {
                        this.dataType = 'string'
                    }else{
                        throw {
                            message: {
                                message: "data should be an object, an array or a string.",
                                status: "error",
                                data: null
                            },
                            statusCode
                        }
                    }
                }
                
                if(!rule.field){
                    throw {
                        message: {
                            message: "rule.field is required.",
                            status: "error",
                            data: null
                        },
                        statusCode
                    }
                }else{
                    if(typeof rule.field === 'string'){
                        if(!rule.field.trim()){
                            throw {
                                message: {
                                    message: "rule.field is required.",
                                    status: "error",
                                    data: null
                                },
                                statusCode
                            }
                        }
                    }else{
                        throw {
                            message: {
                                message: "rule.field is requires string.",
                                status: "error",
                                data: null
                            },
                            statusCode
                        }
                    }
                }
                if(!rule.condition){
                    throw {
                        message: {
                            message: "rule.condition is required.",
                            status: "error",
                            data: null
                        },
                        statusCode
                    }
                }else{
                    if(typeof rule.condition === 'string'){
                        if(!rule.condition.trim()){
                            throw {
                                message: {
                                    message: "rule.field is required.",
                                    status: "error",
                                    data: null
                                },
                                statusCode
                            }
                        }
                    }else{
                        throw {
                            message: {
                                message: "rule.condition requires string.",
                                status: "error",
                                data: null
                            },
                            statusCode
                        }
                    }
                }
                if(typeof rule.condition_value === 'string'){
                    if(!rule.condition_value){
                        throw {
                            message: {
                                message: "rule.condition_value is required.",
                                status: "error",
                                data: null
                            },
                            statusCode
                        }
                    }else{
                        if(!rule.condition_value.trim()){
                            throw {
                                message: {
                                    message: "rule.condition_value is required.",
                                    status: "error",
                                    data: null
                                },
                                statusCode
                            }
                        }
                    }
                }else{
                    if(!rule.condition_value){
                        throw {
                            message: {
                                message: "rule.condition_value is required.",
                                status: "error",
                                data: null
                            },
                            statusCode
                        }
                    }
                }
                if(!objCheck(condition, rule.condition)){
                    throw {
                        message: {
                            message: `rule.condition is not valid.`,
                            status: "error",
                            data: null
                        },
                        statusCode
                    }
                }
                this.rule = rule;
                this.data = data;
                this.validatedValue = null;
                this.message = null;
                this.status = null;
                this.retData = null;
            }

            get getDataType() {
                return this.dataType
            }

            get getMessage() {
                return this.message
            }

            get getStatus() {
                return this.status
            }

            get getRetData() {
                return this.retData
            }

            #messageSet(message){
                this.message = message
            }

            #statusSet(status){
                this.status = status
            }

            #retDataSet(data){
                this.retData = data
            }

            checkValidation() {
                if(this.dataType === 'object'){
                    return this.#objectValidation()
                }else if(this.dataType === 'array'){
                    return this.#arrayValidation()
                }else{
                    return this.#stringValidation()
                }
            }

            #stringValidation(){
                const field = parseInt(this.rule.field, 10)               
                if(!isNaN(field)){
                    if(field > this.data.length -1 ){
                        throw {
                            message:{
                                message: `field ${this.rule.field} is missing from data.`,
                                status: "error",
                                data: null
                            },
                            statusCode
                        }
                    }

                    const retVal = {
                        message: null,
                        status: null,
                        data: {
                            validation: {
                                error: null,
                                field: this.rule.field,
                                field_value: this.data.charAt(field),
                                condition: this.rule.condition,
                                condition_value: this.rule.condition_value
                            }
                        }
                    }
                    if(this.rule.condition !== 'contains'){
                        if(compareItems(this.data.charAt(field), condition[this.rule.condition], this.rule.condition_value)){
                            retVal["data"]["validation"]["error"] = false; 
                            this.#messageSet(`field ${this.rule.field} successfully validated.`)
                            this.#statusSet('success')
                            this.#retDataSet(retVal["data"])
                        }else{
                            retVal["message"] = `field ${this.rule.field} failed validation.`;
                            retVal["status"] = "error";
                            retVal["data"]["validation"]["error"] = true;
                            throw {
                                message: retVal,
                                statusCode
                            }
                        }
                    }else{
                        retVal["message"] = `field ${this.rule.field} failed validation.`;
                        retVal["status"] = "error";
                        retVal["data"]["validation"]["error"] = true;
                        throw {
                            message: retVal,
                            statusCode
                        }
                    }
                }else{
                    throw {
                        message:{
                            message: `field ${this.rule.field} is missing from data.`,
                            status: "error",
                            data: null
                        },
                        statusCode
                    }
                }
            }

            #arrayValidation(){
                const field = parseInt(this.rule.field, 10)               
                if(!isNaN(field)){
                    const retVal = {
                        message: null,
                        status: null,
                        data: {
                            validation: {
                                error: null,
                                field: this.rule.field,
                                field_value: this.data[field],
                                condition: this.rule.condition,
                                condition_value: this.rule.condition_value
                            }
                        }
                    }
                    if((this.data.length - 1) < field || field < 0){
                        throw {
                            message:{
                                message: `field ${this.rule.field} is missing from data.`,
                                status: "error",
                                data: null
                            },
                            statusCode
                        }
                    }else{
                        if(typeof this.data[field] === 'string' || typeof this.data[field] === 'number'){
                            if(this.rule.condition !== 'contains'){
                                if(this.rule.condition === 'eq' || this.rule.condition === 'neq'){         
                                    if(compareItems(this.data[field], condition[this.rule.condition], this.rule.condition_value)){
                                        retVal["data"]["validation"]["error"] = false; 
                                        this.#messageSet(`field ${this.rule.field} successfully validated.`)
                                        this.#statusSet('success')
                                        this.#retDataSet(retVal["data"])
                                    }else{
                                        retVal["message"] = `field ${this.rule.field} failed validation.`;
                                        retVal["status"] = "error";
                                        retVal["data"]["validation"]["error"] = true;
                                        throw {
                                            message: retVal,
                                            statusCode
                                        }
                                    }
                                }else {
                                    if((typeof this.data[field] === 'string' && typeof this.rule.condition_value === 'string') 
                                    || typeof this.data[field] === 'number' && typeof this.rule.condition_value === 'number'){
                                        if(compareItems(this.data[field], condition[this.rule.condition], this.rule.condition_value)){
                                            retVal["data"]["validation"]["error"] = false; 
                                            this.#messageSet(`field ${this.rule.field} successfully validated.`)
                                            this.#statusSet('success')
                                            this.#retDataSet(retVal["data"])
                                        }else{
                                            retVal["message"] = `field ${this.rule.field} failed validation.`;
                                            retVal["status"] = "error";
                                            retVal["data"]["validation"]["error"] = true;
                                            throw {
                                                message: retVal,
                                                statusCode
                                            }
                                        }
                                    }else{
                                        retVal["message"] = `field ${this.rule.field} failed validation.`;
                                        retVal["status"] = "error";
                                        retVal["data"]["validation"]["error"] = true;
                                        throw {
                                            message: retVal,
                                            statusCode
                                        }
                                    }
                                }
                            }else{
                                let dat_field_value = this.data[field]
                                if(typeof this.data[field] === 'number'){
                                    dat_field_value = this.data[field].toString()
                                }
                                if(dat_field_value.includes(this.rule.condition_value)){
                                    retVal["data"]["validation"]["error"] = false; 
                                    this.#messageSet(`field ${this.rule.field} successfully validated.`)
                                    this.#statusSet('success')
                                    this.#retDataSet(retVal["data"])
                                }else{
                                    retVal["message"] = `field ${this.rule.field} failed validation.`;
                                    retVal["status"] = "error";
                                    retVal["data"]["validation"]["error"] = true;
                                    throw {
                                        message: retVal,
                                        statusCode
                                    }
                                }
                            }
                        }else{
                            if(this.data[field].constructor === Object){
                                if(this.rule.condition === 'contains'){
                                    if(typeof this.rule.condition_value === 'string'){
                                        if(objCheck(this.data[field], this.rule.condition_value)){
                                            retVal["data"]["validation"]["error"] = false; 
                                            this.#messageSet(`field ${this.rule.field} successfully validated.`)
                                            this.#statusSet('success')
                                            this.#retDataSet(retVal["data"])
                                        }else{
                                            retVal["message"] = `field ${this.rule.field} failed validation.`;
                                            retVal["status"] = "error";
                                            retVal["data"]["validation"]["error"] = true;
                                            throw {
                                                message: retVal,
                                                statusCode
                                            }
                                        }
                                    }else{
                                        retVal["message"] = `field ${this.rule.field} failed validation.`;
                                        retVal["status"] = "error";
                                        retVal["data"]["validation"]["error"] = true;
                                        throw {
                                            message: retVal,
                                            statusCode
                                        }
                                    }
                                }else{
                                    if(this.rule.condition === 'eq' || this.rule.condition === 'neq'){
                                        // javascript object and arrrays are stored by reference,
                                        // As a result, const a = {a: 'a'} and const b = {a: 'a'} are NOT equal
                                        // To be able to compare them to know if they have identical properties at
                                        // same index, we convert to string using using JSON.stringify
                                        if(compareItems(JSON.stringify(this.data[field]), condition[this.rule.condition], JSON.stringify(this.rule.condition_value))){
                                            retVal["data"]["validation"]["error"] = false; 
                                            this.#messageSet(`field ${this.rule.field} successfully validated.`)
                                            this.#statusSet('success')
                                            this.#retDataSet(retVal["data"])
                                        }else{
                                            retVal["message"] = `field ${this.rule.field} failed validation.`;
                                            retVal["status"] = "error";
                                            retVal["data"]["validation"]["error"] = true;
                                            throw {
                                                message: retVal,
                                                statusCode
                                            }
                                        }
                                    }else{
                                        retVal["message"] = `field ${this.rule.field} failed validation.`;
                                        retVal["status"] = "error";
                                        retVal["data"]["validation"]["error"] = true;
                                        throw {
                                            message: retVal,
                                            statusCode
                                        }
                                    }
                                }
                            }else if(Array.isArray(this.data[field])){
                                if(Array.isArray(this.rule.condition_value)){
                                    if(this.rule.condition === 'contains'){
                                        retVal["message"] = `field ${this.rule.field} failed validation.`;
                                        retVal["status"] = "error";
                                        retVal["data"]["validation"]["error"] = true;
                                        throw {
                                            message: retVal,
                                            statusCode
                                        }
                                    }else{
                                        if(this.rule.condition === 'eq' || this.rule.condition === 'neq'){
                                            // javascript object and arrrays are stored by reference,
                                            // As a result, const a = {a: 'a'} and const b = {a: 'a'} are NOT equal
                                            // To be able to compare them to know if they have identical properties at
                                            // same index, we convert to string using using JSON.stringify
                                            if(compareItems(JSON.stringify(this.data[field]), condition[this.rule.condition], JSON.stringify(this.rule.condition_value))){
                                                retVal["data"]["validation"]["error"] = false; 
                                                this.#messageSet(`field ${this.rule.field} successfully validated.`)
                                                this.#statusSet('success')
                                                this.#retDataSet(retVal["data"])
                                            }else{
                                                retVal["message"] = `field ${this.rule.field} failed validation.`;
                                                retVal["status"] = "error";
                                                retVal["data"]["validation"]["error"] = true;
                                                throw {
                                                    message: retVal,
                                                    statusCode
                                                }
                                            }
                                        }else{
                                            retVal["message"] = `field ${this.rule.field} failed validation.`;
                                            retVal["status"] = "error";
                                            retVal["data"]["validation"]["error"] = true;
                                            throw {
                                                message: retVal,
                                                statusCode
                                            }
                                        }
                                    }
                                }else{
                                    if(this.rule.condition === 'contains'){
                                        if(typeof this.rule.condition_value === 'string' || this.rule.condition_value === 'number'){
                                            if(arrayCheck(this.data[field], this.rule.condition_value)){
                                                retVal["data"]["validation"]["error"] = false; 
                                                this.#messageSet(`field ${this.rule.field} successfully validated.`)
                                                this.#statusSet('success')
                                                this.#retDataSet(retVal["data"])
                                            }else{
                                                retVal["message"] = `field ${this.rule.field} failed validation.`;
                                                retVal["status"] = "error";
                                                retVal["data"]["validation"]["error"] = true;
                                                throw {
                                                    message: retVal,
                                                    statusCode
                                                }
                                            }
                                        }else{
                                            if(this.rule.condition_value.constructor === Object){
                                                if(this.data[field].some(element => element.constructor === Object && JSON.stringify(element) === JSON.stringify(this.rule.condition_value))){
                                                    retVal["data"]["validation"]["error"] = false; 
                                                    this.#messageSet(`field ${this.rule.field} successfully validated.`)
                                                    this.#statusSet('success')
                                                    this.#retDataSet(retVal["data"]) 
                                                }else{
                                                    retVal["message"] = `field ${this.rule.field} failed validation.`;
                                                    retVal["status"] = "error";
                                                    retVal["data"]["validation"]["error"] = true;
                                                    throw {
                                                        message: retVal,
                                                        statusCode
                                                    }
                                                }
                                                
                                            }else{
                                                retVal["message"] = `field ${this.rule.field} failed validation.`;
                                                retVal["status"] = "error";
                                                retVal["data"]["validation"]["error"] = true;
                                                throw {
                                                    message: retVal,
                                                    statusCode
                                                }
                                            }
                                        }
                                    }else{
                                        retVal["message"] = `field ${this.rule.field} failed validation.`;
                                        retVal["status"] = "error";
                                        retVal["data"]["validation"]["error"] = true;
                                        throw {
                                            message: retVal,
                                            statusCode
                                        }
                                    }
                                }
                            }
                        }
                    }
                }else{
                    throw {
                        message:{
                            message: `field ${this.rule.field} is missing from data.`,
                            status: "error",
                            data: null
                        },
                        statusCode
                    }
                }
            }

            #objectValidation(){
                // checks that rule.field has a . in it and that the dot doesn't start the string
                const index_position = this.rule.field.indexOf('.')
                if(index_position === -1 || index_position > 0){

                    // splits the rule.field string into an array
                    const arr_val = this.rule.field.split('.');

                    // checks that the array length is not more than 2, meaning not more than 2 nesting
                    if(arr_val.length < 3){
                        this.validatedValue = arr_val.length === 2 ? 
                            this.data[arr_val[0]][arr_val[1]] : this.data[arr_val[0]] ;
                        if(this.validatedValue === undefined){
                            throw {
                                message: {
                                    message: `field ${this.rule.field} is missing from data.`,
                                    status: "error",
                                    data: null
                                },
                                statusCode
                            }                                
                        }
                        const retVal = {
                            message: null,
                            status: null,
                            data: {
                                validation: {
                                    error: null,
                                    field: this.rule.field,
                                    field_value: this.validatedValue,
                                    condition: this.rule.condition,
                                    condition_value: this.rule.condition_value
                                }
                            }
                        }
                        if(this.rule.condition !== 'contains'){
                            if(compareItems(this.validatedValue ,condition[this.rule.condition], this.rule.condition_value)){
                                retVal["data"]["validation"]["error"] = false; 
                                this.#messageSet(`field ${this.rule.field} successfully validated.`)
                                this.#statusSet('success')
                                this.#retDataSet(retVal["data"])                      
                            }else{
                                retVal["message"] = `field ${this.rule.field} failed validation.`;
                                retVal["status"] = "error";
                                retVal["data"]["validation"]["error"] = true;
                                throw {
                                    message: retVal,
                                    statusCode
                                }
                            }
                        }else{
                            if(this.validatedValue.constructor === Object){
                                if(objCheck(this.validatedValue, this.rule.condition_value)){
                                    retVal["data"]["validation"]["error"] = false; 
                                    this.#messageSet(`field ${this.rule.field} successfully validated.`)
                                    this.#statusSet('success')
                                    this.#retDataSet(retVal["data"]) 
                                }else{
                                    retVal["message"] = `field ${this.rule.field} failed validation.`;
                                    retVal["status"] = "error";
                                    retVal["data"]["validation"]["error"] = true;
                                    throw {
                                        message: retVal,
                                        statusCode
                                    }
                                }
                            }else{
                                if(Array.isArray(this.validatedValue)){
                                    if(arrayCheck(this.validatedValue, this.rule.condition_value)){
                                        retVal["data"]["validation"]["error"] = false; 
                                        this.#messageSet(`field ${this.rule.field} successfully validated.`)
                                        this.#statusSet('success')
                                        this.#retDataSet(retVal["data"]) 
                                    }else{
                                        retVal["message"] = `field ${this.rule.field} failed validation.`;
                                        retVal["status"] = "error";
                                        retVal["data"]["validation"]["error"] = true;
                                        throw {
                                            message: retVal,
                                            statusCode
                                        }
                                    }
                                }else{
                                    retVal["message"] = `field ${this.rule.field} failed validation. .`;
                                    retVal["status"] = "error";
                                    retVal["data"]["validation"]["error"] = true;
                                    throw {
                                        message: retVal,
                                        statusCode
                                    }
                                }
                            }
                            
                        }
                    }else{
                        throw {
                            message: {
                                message: `field ${this.rule.field} is missing from data.`,
                                status: "error",
                                data: null
                            },
                            statusCode
                        }
                    }
                }else{
                    throw {
                        message: {
                            message: `field ${this.rule.field} is missing from data.`,
                            status: "error",
                            data: null
                        },
                        statusCode
                    }  
                }
            }
        }
        return new Validation(payload)
    }
}