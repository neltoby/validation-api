const { validationFxn } = require('./');
const makeRequest = require('../../__test__/makeRequest');

let req;
beforeEach(() => {
    req = makeRequest({})
})

describe('validation class suite', () => {

    test('valid json object', () => {
        req = JSON.stringify(req)
        expect(() => validationFxn(req)).toThrow()
    })

    test('missing rule field', () => {
        delete req.rule
        expect(() => validationFxn(req)).toThrow()
    })

    test('missing data field', () => {
        delete req.data
        expect(() => validationFxn(req)).toThrow()
    })

    test('rule field must be an object', () => {
        req = makeRequest({rule: 8})
        expect(() => validationFxn(req)).toThrow()
    })

    test('data field can be a json', () => {
        let reqs = makeRequest({})
        const res = validationFxn(reqs)
        expect(res.getDataType).toBe('object')
    })

    test('data field can be an array', () => {
        let reqs = makeRequest({data: []})
        const res = validationFxn(reqs)
        expect(res.getDataType).toBe('array')
    })

    test('data field can be a string', () => {
        let reqs = makeRequest({data: 'strings'})
        const res = validationFxn(reqs)
        expect(res.getDataType).toBe('string')
    })

    test('data field must be an array, a json or a string', () => {
        let reqs = makeRequest({data: 5})
        expect(() => validationFxn(reqs)).toThrow()
    })

    test('field sub field of the rule field must be present', () => {
        req.rule.field = '  '
        expect(() => validationFxn(req)).toThrow()
    })

    test('condition sub field of the rule field must be present', () => {
        req.rule.condition = '  '
        expect(() => validationFxn(req)).toThrow()
    })

    test('condition_value sub field of the rule field must be present', () => {
        req.rule.condition_value = null
        expect(() => validationFxn(req)).toThrow()
    })

    test('condition sub field of the rule field can be "eq"', () => {
        req.rule.condition = 'eq'
        expect(validationFxn(req)).toBeDefined()
    })

    test('condition sub field of the rule field can be "neq"', () => {
        req.rule.condition = 'neq'
        expect(validationFxn(req)).toBeDefined()
    })

    test('condition sub field of the rule field can be "gt"', () => {
        req.rule.condition = 'gt'
        expect(validationFxn(req)).toBeDefined()
    })

    test('condition sub field of the rule field can be "gte"', () => {
        req.rule.condition = 'gte'
        expect(validationFxn(req)).toBeDefined()
    })

    test('condition sub field of the rule field can be "contains"', () => {
        req.rule.condition = 'contains'
        expect(validationFxn(req)).toBeDefined()
    })

    test('condition sub field of the rule field can accept any [eq, neq, gt, gte, contains]', () => {
        req.rule.condition = 'lt'
        expect(() => validationFxn(req)).toThrow()
    })

    test('field value missing from the data passed(single step)', () => {
        req.rule.field = 'missing_field'
        const new_val_ins = validationFxn(req)
        expect(() => new_val_ins.checkValidation()).toThrow()
    })

    test('field value missing from the data passed(double step)', () => {
        req.rule.field = 'missions.missing_field'
        const new_val_ins = validationFxn(req)
        expect(() => new_val_ins.checkValidation()).toThrow()
    })

    test('field value missing from the data passed(third step)', () => {
        req.rule.field = 'missions.missing_field.missing_field'
        const new_val_ins = validationFxn(req)
        expect(() => new_val_ins.checkValidation()).toThrow()
    })

})

describe('test condition values', () => {

    describe('when data field field id an object', () => {

        describe('eq condition', () => {

            test('validates field value with one step into the data object successfully', () => {
                req.rule.field = 'age'
                req.rule.condition = 'eq'
                req.rule.condition_value = 30
                req.data.age = 30
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field age successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: 'age',
                        field_value: 30,
                        condition: 'eq',
                        condition_value: 30
                    }
                })
            })

            test('validates field value with two step into the data object successfully', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'eq'
                req.rule.condition_value = 30
                req.data.missions.count = 30
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field missions.count successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: 'missions.count',
                        field_value: 30,
                        condition: 'eq',
                        condition_value: 30
                    }
                })
            })

            test('failed validation of field value with one step into the data object', () => {
                req.rule.field = 'age'
                req.rule.condition = 'eq'
                req.rule.condition_value = 30
                req.data.age = 31
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('failed validation of field value with two step into the data object', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'eq'
                req.rule.condition_value = 30
                req.data.missions.count = 31
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

        })

        describe('neq condition', () => {

            test('validates field value with one step into the data object successfully', () => {
                req.rule.field = 'age'
                req.rule.condition = 'neq'
                req.rule.condition_value = 30
                req.data.age = 31
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field age successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: 'age',
                        field_value: 31,
                        condition: 'neq',
                        condition_value: 30
                    }
                })
            })

            test('validates field value with two step into the data object successfully', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'neq'
                req.rule.condition_value = 30
                req.data.missions.count = 31
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field missions.count successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: 'missions.count',
                        field_value: 31,
                        condition: 'neq',
                        condition_value: 30
                    }
                })
            })

            test('failed validation of field value with one step into the data object', () => {
                req.rule.field = 'age'
                req.rule.condition = 'neq'
                req.rule.condition_value = 30
                req.data.age = 30
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('failed validation of field value with two step into the data object', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'neq'
                req.rule.condition_value = 30
                req.data.missions.count = 30
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

        })

        describe('gt condition', () => {

            test('validates field value with one step into the data object successfully', () => {
                req.rule.field = 'age'
                req.rule.condition = 'gt'
                req.rule.condition_value = 30
                req.data.age = 31
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field age successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: 'age',
                        field_value: 31,
                        condition: 'gt',
                        condition_value: 30
                    }
                })
            })

            test('validates field value with two step into the data object successfully', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'gt'
                req.rule.condition_value = 30
                req.data.missions.count = 31
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field missions.count successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: 'missions.count',
                        field_value: 31,
                        condition: 'gt',
                        condition_value: 30
                    }
                })
            })

            test('failed validation of field value with one step into the data object', () => {
                req.rule.field = 'age'
                req.rule.condition = 'gt'
                req.rule.condition_value = 30
                req.data.age = 30
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('failed validation of field value with two step into the data object', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'gt'
                req.rule.condition_value = 30
                req.data.missions.count = 30
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

        })

        describe('gte condition', () => {

            test('validates field value with one step into the data object successfully', () => {
                req.rule.field = 'age'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.age = 31
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field age successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: 'age',
                        field_value: 31,
                        condition: 'gte',
                        condition_value: 30
                    }
                })
            })

            test('validates field value with two step into the data object successfully', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.missions.count = 30
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field missions.count successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: 'missions.count',
                        field_value: 30,
                        condition: 'gte',
                        condition_value: 30
                    }                   
                })
            })

            test('failed validation of field value with one step into the data object', () => {
                req.rule.field = 'age'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.age = 20
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('failed validation of field value with two step into the data object', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.missions.count = 20
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

        })

        describe('gte condition', () => {

            test('validates field value with one step into the data object successfully', () => {
                req.rule.field = 'age'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.age = 31
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field age successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: 'age',
                        field_value: 31,
                        condition: 'gte',
                        condition_value: 30
                    }
                })
            })

            test('validates field value with two step into the data object successfully', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.missions.count = 30
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field missions.count successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: 'missions.count',
                        field_value: 30,
                        condition: 'gte',
                        condition_value: 30
                    }
                })
            })

            test('failed validation of field value with one step into the data object', () => {
                req.rule.field = 'age'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.age = 20
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('failed validation of field value with two step into the data object', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.missions.count = 20
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

        })

        describe('contains condition', () => {
            let crew = {node: 31, javascript: 33}

            test('validates field value with one step into the data object successfully', () => {
                req.rule.field = 'crew'
                req.rule.condition = 'contains'
                req.rule.condition_value = 'node'
                req.data.crew = crew
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field crew successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: 'crew',
                        field_value: crew,
                        condition: 'contains',
                        condition_value: 'node'
                    }
                })
            })

            test('validates field value with two step into the data object successfully', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'contains'
                req.rule.condition_value = 'node'
                req.data.missions.count = crew
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field missions.count successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: 'missions.count',
                        field_value: crew,
                        condition: 'contains',
                        condition_value: 'node'
                    }
                })
            })

            test('failed validation of field value with one step into the data object', () => {
                req.rule.field = 'crew'
                req.rule.condition = 'contains'
                req.rule.condition_value = 'java'
                req.data.crew = crew
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('failed validation of field value with two step into the data object', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'contains'
                req.rule.condition_value = 'java'
                req.data.missions.count = crew
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

        })

    })

    describe('when data field is an array', () => {
        let arr = ['javascript', 'nodes', 'php', 'java', 'C#', '5', ['java', 'python', 'ruby'], 4590]

        describe('validation', () => {

            test('should throw if field is not a number', () => {
                req.rule.field = 'search'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('should throw if field is bigger than array length', () => {
                req.rule.field = '15'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('should throw if field is lesser than 0', () => {
                req.rule.field = '-1'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

        })

        describe('eq  successful condition', () => {

            test('string as the data type of the element at the specified field position', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'php'
                req.rule.condition ='eq'
                req.data = arr
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 2 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '2',
                        field_value: 'php',
                        condition: 'eq',
                        condition_value: 'php'
                    }
                })
            })

            test('number as the data type of the element at the specified field position', () => {
                req.rule.field = '5'
                req.rule.condition_value = '5'
                req.rule.condition ='eq'
                req.data = arr
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 5 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '5',
                        field_value: '5',
                        condition: 'eq',
                        condition_value: '5'
                    }
                })
            })

            test('array as the data type of the element at the specified field position', () => {
                req.rule.field = '6'
                req.rule.condition_value = ['java', 'python', 'ruby']
                req.rule.condition ='eq'
                req.data = arr
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 6 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '6',
                        field_value: ['java', 'python', 'ruby'],
                        condition: 'eq',
                        condition_value: ['java', 'python', 'ruby']
                    }
                })
            })

        })

        describe('eq failed condition', () => {

            test('string/number as the data type of the element at the specified field position', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'java'
                req.rule.condition ='eq'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('string/number as the data type of the element at the specified field position with number/string as condition value', () => {
                req.rule.field = '7'
                req.rule.condition_value = '4590'
                req.rule.condition ='eq'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('array as the data type of the element at the specified field position', () => {
                req.rule.field = '6'
                req.rule.condition_value = 'C#'
                req.rule.condition ='eq'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

        })

        describe('gte  successful condition', () => {

            test('string as the data type of the element at the specified field position', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'php'
                req.rule.condition ='gte'
                req.data = arr
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 2 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '2',
                        field_value: 'php',
                        condition: 'gte',
                        condition_value: 'php'
                    }
                })
            })

            test('number as the data type of the element at the specified field position', () => {
                req.rule.field = '7'
                req.rule.condition_value = 4590
                req.rule.condition ='gte'
                req.data = arr
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 7 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '7',
                        field_value: 4590,
                        condition: 'gte',
                        condition_value: 4590
                    }
                })
            })

        })

        describe('gte failed condition', () => {

            test('string as the data type of the element at the specified field position with string as condition', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'python'
                req.rule.condition ='gte'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('string as the data type of the element at the specified field position with number as condition', () => {
                req.rule.field = '2'
                req.rule.condition_value = 3
                req.rule.condition ='gte'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('number as the data type of the element at the specified field position with string as condition', () => {
                req.rule.field = '7'
                req.rule.condition_value = '4590'
                req.rule.condition ='gte'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('array as the data type of the element at the specified field position with rule condition array', () => {
                req.rule.field = '6'
                req.rule.condition_value = ['java', 'python', 'ruby']
                req.rule.condition ='gte'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('array as the data type of the element at the specified field position with rule condition string/number', () => {
                req.rule.field = '6'
                req.rule.condition_value = 'java'
                req.rule.condition ='gte'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

        })

        describe('gt  successful condition', () => {

            test('string as the data type of the element at the specified field position', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'java'
                req.rule.condition ='gt'
                req.data = arr
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 2 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '2',
                        field_value: 'php',
                        condition: 'gt',
                        condition_value: 'java'
                    }
                })
            })

            test('number as the data type of the element at the specified field position', () => {
                req.rule.field = '7'
                req.rule.condition_value = 4490
                req.rule.condition ='gt'
                req.data = arr
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 7 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '7',
                        field_value: 4590,
                        condition: 'gt',
                        condition_value: 4490
                    }
                })
            })

        })

        describe('gt failed condition', () => {

            test('string as the data type of the element at the specified field position with string as condition', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'python'
                req.rule.condition ='gt'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('string as the data type of the element at the specified field position with number as condition', () => {
                req.rule.field = '2'
                req.rule.condition_value = 3
                req.rule.condition ='gt'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('number as the data type of the element at the specified field position with string as condition', () => {
                req.rule.field = '7'
                req.rule.condition_value = '4590'
                req.rule.condition ='gt'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('array as the data type of the element at the specified field position with rule condition array', () => {
                req.rule.field = '6'
                req.rule.condition_value = ['java', 'python', 'ruby']
                req.rule.condition ='gt'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('array as the data type of the element at the specified field position with rule condition string/number', () => {
                req.rule.field = '6'
                req.rule.condition_value = 'java'
                req.rule.condition ='gt'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

        })

        describe('neq  successful condition', () => {

            test('string as the data type of the element at the specified field position', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'phpi'
                req.rule.condition ='neq'
                req.data = arr
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 2 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '2',
                        field_value: 'php',
                        condition: 'neq',
                        condition_value: 'phpi'
                    }
                })
            })

            test('number as the data type of the element at the specified field position', () => {
                req.rule.field = '7'
                req.rule.condition_value = '4590'
                req.rule.condition ='neq'
                req.data = arr
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 7 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '7',
                        field_value: 4590,
                        condition: 'neq',
                        condition_value: '4590'
                    }
                })
            })

            test('array as the data type of the element at the specified field position', () => {
                req.rule.field = '6'
                req.rule.condition_value = ['java', 'python', 'C#']
                req.rule.condition ='neq'
                req.data = arr
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 6 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '6',
                        field_value: ['java', 'python', 'ruby'],
                        condition: 'neq',
                        condition_value: ['java', 'python', 'C#']
                    }
                })
            })

        })

        describe('neq failed condition', () => {

            test('string/number as the data type of the element at the specified field position', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'php'
                req.rule.condition ='neq'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('string/number as the data type of the element at the specified field position with number/string as condition value', () => {
                req.rule.field = '7'
                req.rule.condition_value = 4590
                req.rule.condition ='neq'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('array as the data type of the element at the specified field position', () => {
                req.rule.field = '6'
                req.rule.condition_value = ['java', 'python', 'ruby']
                req.rule.condition = 'neq'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

        })
        
        describe('contains  successful condition', () => {

            test('string as the data type of the element at the specified field position', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'php'
                req.rule.condition ='contains'
                req.data = arr
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 2 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '2',
                        field_value: 'php',
                        condition: 'contains',
                        condition_value: 'php'
                    }
                })
            })

            test('number as the data type of the element at the specified field position', () => {
                req.rule.field = '7'
                req.rule.condition_value = '5'
                req.rule.condition ='contains'
                req.data = arr
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 7 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '7',
                        field_value: 4590,
                        condition: 'contains',
                        condition_value: '5'
                    }
                })
            })

            test('array as the data type of the element at the specified field position', () => {
                req.rule.field = '6'
                req.rule.condition_value = 'java'
                req.rule.condition ='contains'
                req.data = arr
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 6 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '6',
                        field_value: ['java', 'python', 'ruby'],
                        condition: 'contains',
                        condition_value: 'java'
                    }
                })
            })

        })

        describe('contains failed condition', () => {

            test('string as the data type of the element at the specified field position', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'java'
                req.rule.condition ='contains'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('number as the data type of the element at the specified field position', () => {
                req.rule.field = '7'
                req.rule.condition_value = 7
                req.rule.condition ='contains'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('array as the data type of the element at the specified field position with rule condition value also an array', () => {
                req.rule.field = '6'
                req.rule.condition_value = ['java', 'python', 'ruby']
                req.rule.condition ='contains'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('array as the data type of the element at the specified field position with rule condition value as string or number', () => {
                req.rule.field = '6'
                req.rule.condition_value = 'C#'
                req.rule.condition ='contains'
                req.data = arr
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

        })
    })

    describe('when data field is a string', () => {
        let data = 'outreach'

        beforeEach(() => {
            req.data = data
        })
        
        describe('validation', () => {

            test('to throw when field value is bigger than the index of the last letter', () => {
                req.rule.field = '8'
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })
            
        })

        describe('eq condition', () => {
            test('condition_value should equal value at specified data index', () => {
                req.rule.field = '2'
                req.rule.condition_value = 't'
                req.rule.condition = 'eq'
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 2 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '2',
                        field_value: 't',
                        condition: 'eq',
                        condition_value: 't'
                    }
                })
            })

            test('condition_value should not equal value at specified data index', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'o'
                req.rule.condition = 'eq'
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })
        })

        describe('neq condition', () => {
            test('condition_value should not equal field value at specified data index', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'o'
                req.rule.condition = 'neq'
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 2 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '2',
                        field_value: 't',
                        condition: 'neq',
                        condition_value: 'o'
                    }
                })
            })

            test('condition_value should not equal value at specified data index', () => {
                req.rule.field = '2'
                req.rule.condition_value = 't'
                req.rule.condition = 'neq'
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })
        })

        describe('gt condition', () => {
            test('condition_value should be greater than value specified in data index', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'j'
                req.rule.condition = 'gt'
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 2 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '2',
                        field_value: 't',
                        condition: 'gt',
                        condition_value: 'j'
                    }
                })
            })

            test('condition_value should not be greater than value specified in the data index', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'u'
                req.rule.condition = 'gt'
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })
        })

        describe('gte condition', () => {
            test('condition_value should be >= value specified in data index', () => {
                req.rule.field = '2'
                req.rule.condition_value = 't'
                req.rule.condition = 'gte'
                const new_val_ins = validationFxn(req)
                new_val_ins.checkValidation()
                expect(new_val_ins.getMessage).toBe('field 2 successfully validated.')
                expect(new_val_ins.getStatus).toBe('success')
                expect(new_val_ins.getRetData).toEqual({
                    validation: {
                        error: false,
                        field: '2',
                        field_value: 't',
                        condition: 'gte',
                        condition_value: 't'
                    }
                })
            })

            test('condition_value should !(>=) value specified in the data index', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'u'
                req.rule.condition = 'gte'
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })
        })

        describe('contains condition', () => {
            test('should fail validation for data field with string', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'j'
                req.rule.condition = 'contains'
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })
        })

    })

})
