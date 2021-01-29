const { validationFxn } = require('./')
const makeRequest = require('../../__test__/makeRequest')

let req;
beforeEach(() => {
    req = makeRequest({})
})

describe('validation class suite', () => {

    test('valid json object', () => {
        expect(() => validationFxn(req)).toThrow()
    })

    test('missing rule field', () => {
        delete req.rule
       req = JSON.stringify(req)
        expect(() => validationFxn(req)).toThrow()
    })

    test('missing data field', () => {
        delete req.data
       req = JSON.stringify(req)
        expect(() => validationFxn(req)).toThrow()
    })

    test('rule field must be an object', () => {
        req = makeRequest({rule: 8})
        req = JSON.stringify(req)
        expect(() => validationFxn(req)).toThrow()
    })

    test('data field can be a json', () => {
        let reqs = makeRequest({})
        reqs = JSON.stringify(reqs)
        const res = validationFxn(reqs)
        expect(res.getDataType).toBe('object')
    })

    test('data field can be an array', () => {
        let reqs = makeRequest({data: []})
        reqs = JSON.stringify(reqs)
        const res = validationFxn(reqs)
        expect(res.getDataType).toBe('array')
    })

    test('data field can be a string', () => {
        let reqs = makeRequest({data: 'strings'})
        reqs = JSON.stringify(reqs)
        const res = validationFxn(reqs)
        expect(res.getDataType).toBe('string')
    })

    test('data field must be an array, a json or a string', () => {
        let reqs = makeRequest({data: 5})
        reqs = JSON.stringify(reqs)
        expect(() => validationFxn(reqs)).toThrow()
    })

    test('field sub field of the rule field must be present', () => {
        req.rule.field = '  '
        req = JSON.stringify(req)
        expect(() => validationFxn(req)).toThrow()
    })

    test('condition sub field of the rule field must be present', () => {
        req.rule.condition = '  '
        req = JSON.stringify(req)
        expect(() => validationFxn(req)).toThrow()
    })

    test('condition_value sub field of the rule field must be present', () => {
        req.rule.condition_value = null
        req = JSON.stringify(req)
        expect(() => validationFxn(req)).toThrow()
    })

    test('condition sub field of the rule field can be "eq"', () => {
        req.rule.condition = 'eq'
        req = JSON.stringify(req)
        expect(validationFxn(req)).toBeDefined()
    })

    test('condition sub field of the rule field can be "neq"', () => {
        req.rule.condition = 'neq'
        req = JSON.stringify(req)
        expect(validationFxn(req)).toBeDefined()
    })

    test('condition sub field of the rule field can be "gt"', () => {
        req.rule.condition = 'gt'
        req = JSON.stringify(req)
        expect(validationFxn(req)).toBeDefined()
    })

    test('condition sub field of the rule field can be "gte"', () => {
        req.rule.condition = 'gte'
        req = JSON.stringify(req)
        expect(validationFxn(req)).toBeDefined()
    })

    test('condition sub field of the rule field can be "contains"', () => {
        req.rule.condition = 'contains'
        req = JSON.stringify(req)
        expect(validationFxn(req)).toBeDefined()
    })

    test('condition sub field of the rule field can accept any [eq, neq, gt, gte, contains]', () => {
        req.rule.condition = 'lt'
        req = JSON.stringify(req)
        expect(() => validationFxn(req)).toThrow()
    })

    test('field value missing from the data passed(single step)', () => {
        req.rule.field = 'missing_field'
        req = JSON.stringify(req)
        const new_val_ins = validationFxn(req)
        expect(() => new_val_ins.checkValidation()).toThrow()
    })

    test('field value missing from the data passed(double step)', () => {
        req.rule.field = 'missions.missing_field'
        req = JSON.stringify(req)
        const new_val_ins = validationFxn(req)
        expect(() => new_val_ins.checkValidation()).toThrow()
    })

    test('field value missing from the data passed(third step)', () => {
        req.rule.field = 'missions.missing_field.missing_field'
        req = JSON.stringify(req)
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
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field age successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: 'age',
                            field_value: 30,
                            condition: 'eq',
                            condition_value: 30
                        }
                    }
                })
            })

            test('validates field value with two step into the data object successfully', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'eq'
                req.rule.condition_value = 30
                req.data.missions.count = 30
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field missions.count successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: 'missions.count',
                            field_value: 30,
                            condition: 'eq',
                            condition_value: 30
                        }
                    }
                })
            })

            test('failed validation of field value with one step into the data object', () => {
                req.rule.field = 'age'
                req.rule.condition = 'eq'
                req.rule.condition_value = 30
                req.data.age = 31
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field age failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: 'age',
                            field_value: 31,
                            condition: 'eq',
                            condition_value: 30
                        }
                    }
                })
            })

            test('failed validation of field value with two step into the data object', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'eq'
                req.rule.condition_value = 30
                req.data.missions.count = 31
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field missions.count failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: 'missions.count',
                            field_value: 31,
                            condition: 'eq',
                            condition_value: 30
                        }
                    }
                })
            })

        })

        describe('neq condition', () => {

            test('validates field value with one step into the data object successfully', () => {
                req.rule.field = 'age'
                req.rule.condition = 'neq'
                req.rule.condition_value = 30
                req.data.age = 31
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field age successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: 'age',
                            field_value: 31,
                            condition: 'neq',
                            condition_value: 30
                        }
                    }
                })
            })

            test('validates field value with two step into the data object successfully', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'neq'
                req.rule.condition_value = 30
                req.data.missions.count = 31
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field missions.count successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: 'missions.count',
                            field_value: 31,
                            condition: 'neq',
                            condition_value: 30
                        }
                    }
                })
            })

            test('failed validation of field value with one step into the data object', () => {
                req.rule.field = 'age'
                req.rule.condition = 'neq'
                req.rule.condition_value = 30
                req.data.age = 30
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field age failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: 'age',
                            field_value: 30,
                            condition: 'neq',
                            condition_value: 30
                        }
                    }
                })
            })

            test('failed validation of field value with two step into the data object', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'neq'
                req.rule.condition_value = 30
                req.data.missions.count = 30
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field missions.count failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: 'missions.count',
                            field_value: 30,
                            condition: 'neq',
                            condition_value: 30
                        }
                    }
                })
            })

        })

        describe('gt condition', () => {

            test('validates field value with one step into the data object successfully', () => {
                req.rule.field = 'age'
                req.rule.condition = 'gt'
                req.rule.condition_value = 30
                req.data.age = 31
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field age successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: 'age',
                            field_value: 31,
                            condition: 'gt',
                            condition_value: 30
                        }
                    }
                })
            })

            test('validates field value with two step into the data object successfully', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'gt'
                req.rule.condition_value = 30
                req.data.missions.count = 31
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field missions.count successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: 'missions.count',
                            field_value: 31,
                            condition: 'gt',
                            condition_value: 30
                        }
                    }
                })
            })

            test('failed validation of field value with one step into the data object', () => {
                req.rule.field = 'age'
                req.rule.condition = 'gt'
                req.rule.condition_value = 30
                req.data.age = 30
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field age failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: 'age',
                            field_value: 30,
                            condition: 'gt',
                            condition_value: 30
                        }
                    }
                })
            })

            test('failed validation of field value with two step into the data object', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'gt'
                req.rule.condition_value = 30
                req.data.missions.count = 30
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field missions.count failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: 'missions.count',
                            field_value: 30,
                            condition: 'gt',
                            condition_value: 30
                        }
                    }
                })
            })

        })

        describe('gte condition', () => {

            test('validates field value with one step into the data object successfully', () => {
                req.rule.field = 'age'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.age = 31
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field age successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: 'age',
                            field_value: 31,
                            condition: 'gte',
                            condition_value: 30
                        }
                    }
                })
            })

            test('validates field value with two step into the data object successfully', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.missions.count = 30
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field missions.count successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: 'missions.count',
                            field_value: 30,
                            condition: 'gte',
                            condition_value: 30
                        }
                    }
                })
            })

            test('failed validation of field value with one step into the data object', () => {
                req.rule.field = 'age'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.age = 20
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field age failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: 'age',
                            field_value: 20,
                            condition: 'gte',
                            condition_value: 30
                        }
                    }
                })
            })

            test('failed validation of field value with two step into the data object', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.missions.count = 20
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field missions.count failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: 'missions.count',
                            field_value: 20,
                            condition: 'gte',
                            condition_value: 30
                        }
                    }
                })
            })

        })

        describe('gte condition', () => {

            test('validates field value with one step into the data object successfully', () => {
                req.rule.field = 'age'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.age = 31
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field age successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: 'age',
                            field_value: 31,
                            condition: 'gte',
                            condition_value: 30
                        }
                    }
                })
            })

            test('validates field value with two step into the data object successfully', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.missions.count = 30
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field missions.count successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: 'missions.count',
                            field_value: 30,
                            condition: 'gte',
                            condition_value: 30
                        }
                    }
                })
            })

            test('failed validation of field value with one step into the data object', () => {
                req.rule.field = 'age'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.age = 20
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field age failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: 'age',
                            field_value: 20,
                            condition: 'gte',
                            condition_value: 30
                        }
                    }
                })
            })

            test('failed validation of field value with two step into the data object', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'gte'
                req.rule.condition_value = 30
                req.data.missions.count = 20
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field missions.count failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: 'missions.count',
                            field_value: 20,
                            condition: 'gte',
                            condition_value: 30
                        }
                    }
                })
            })

        })

        describe('contains condition', () => {
            let crew = {node: 31, javascript: 33}

            test('validates field value with one step into the data object successfully', () => {
                req.rule.field = 'crew'
                req.rule.condition = 'contains'
                req.rule.condition_value = 'node'
                req.data.crew = crew
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field crew successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: 'crew',
                            field_value: crew,
                            condition: 'contains',
                            condition_value: 'node'
                        }
                    }
                })
            })

            test('validates field value with two step into the data object successfully', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'contains'
                req.rule.condition_value = 'node'
                req.data.missions.count = crew
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field missions.count successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: 'missions.count',
                            field_value: crew,
                            condition: 'contains',
                            condition_value: 'node'
                        }
                    }
                })
            })

            test('failed validation of field value with one step into the data object', () => {
                req.rule.field = 'crew'
                req.rule.condition = 'contains'
                req.rule.condition_value = 'java'
                req.data.crew = crew
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field crew failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: 'crew',
                            field_value: crew,
                            condition: 'contains',
                            condition_value: 'java'
                        }
                    }
                })
            })

            test('failed validation of field value with two step into the data object', () => {
                req.rule.field = 'missions.count'
                req.rule.condition = 'contains'
                req.rule.condition_value = 'java'
                req.data.missions.count = crew
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field missions.count failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: 'missions.count',
                            field_value: crew,
                            condition: 'contains',
                            condition_value: 'java'
                        }
                    }
                })
            })

        })

    })

    describe('when data field is an array', () => {
        let arr = ['javascript', 'nodes', 'php', 'java', 'C#', '5', ['java', 'python', 'ruby'], 4590]

        describe('validation', () => {

            test('should throw if field is not a number', () => {
                req.rule.field = 'search'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('should throw if field is bigger than array length', () => {
                req.rule.field = '15'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(() => new_val_ins.checkValidation()).toThrow()
            })

            test('should throw if field is lesser than 0', () => {
                req.rule.field = '-1'
                req.data = arr
                req = JSON.stringify(req)
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
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 2 successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: '2',
                            field_value: 'php',
                            condition: 'eq',
                            condition_value: 'php'
                        }
                    }
                })
            })

            test('number as the data type of the element at the specified field position', () => {
                req.rule.field = '5'
                req.rule.condition_value = '5'
                req.rule.condition ='eq'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 5 successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: '5',
                            field_value: '5',
                            condition: 'eq',
                            condition_value: '5'
                        }
                    }
                })
            })

            test('array as the data type of the element at the specified field position', () => {
                req.rule.field = '6'
                req.rule.condition_value = ['java', 'python', 'ruby']
                req.rule.condition ='eq'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 6 successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: '6',
                            field_value: ['java', 'python', 'ruby'],
                            condition: 'eq',
                            condition_value: ['java', 'python', 'ruby']
                        }
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
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 2 failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: '2',
                            field_value: 'php',
                            condition: 'eq',
                            condition_value: 'java'
                        }
                    }
                })
            })

            test('string/number as the data type of the element at the specified field position with number/string as condition value', () => {
                req.rule.field = '7'
                req.rule.condition_value = '4590'
                req.rule.condition ='eq'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 7 failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: '7',
                            field_value: 4590,
                            condition: 'eq',
                            condition_value: '4590'
                        }
                    }
                })
            })

            test('array as the data type of the element at the specified field position', () => {
                req.rule.field = '6'
                req.rule.condition_value = 'C#'
                req.rule.condition ='eq'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 6 failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: '6',
                            field_value: ['java', 'python', 'ruby'],
                            condition: 'eq',
                            condition_value: 'C#'
                        }
                    }
                })
            })

        })

        describe('neq  successful condition', () => {

            test('string as the data type of the element at the specified field position', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'phpi'
                req.rule.condition ='neq'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 2 successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: '2',
                            field_value: 'php',
                            condition: 'neq',
                            condition_value: 'phpi'
                        }
                    }
                })
            })

            test('number as the data type of the element at the specified field position', () => {
                req.rule.field = '7'
                req.rule.condition_value = '4590'
                req.rule.condition ='neq'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 7 successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: '7',
                            field_value: 4590,
                            condition: 'neq',
                            condition_value: '4590'
                        }
                    }
                })
            })

            test('array as the data type of the element at the specified field position', () => {
                req.rule.field = '6'
                req.rule.condition_value = ['java', 'python', 'C#']
                req.rule.condition ='neq'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 6 successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: '6',
                            field_value: ['java', 'python', 'ruby'],
                            condition: 'neq',
                            condition_value: ['java', 'python', 'C#']
                        }
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
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 2 failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: '2',
                            field_value: 'php',
                            condition: 'neq',
                            condition_value: 'php'
                        }
                    }
                })
            })

            test('string/number as the data type of the element at the specified field position with number/string as condition value', () => {
                req.rule.field = '7'
                req.rule.condition_value = 4590
                req.rule.condition ='neq'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 7 failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: '7',
                            field_value: 4590,
                            condition: 'neq',
                            condition_value: 4590
                        }
                    }
                })
            })

            test('array as the data type of the element at the specified field position', () => {
                req.rule.field = '6'
                req.rule.condition_value = ['java', 'python', 'ruby']
                req.rule.condition = 'neq'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 6 failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: '6',
                            field_value: ['java', 'python', 'ruby'],
                            condition: 'neq',
                            condition_value: ['java', 'python', 'ruby']
                        }
                    }
                })
            })

        })
        
        describe('contains  successful condition', () => {

            test('string as the data type of the element at the specified field position', () => {
                req.rule.field = '2'
                req.rule.condition_value = 'php'
                req.rule.condition ='contains'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 2 successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: '2',
                            field_value: 'php',
                            condition: 'contains',
                            condition_value: 'php'
                        }
                    }
                })
            })

            test('number as the data type of the element at the specified field position', () => {
                req.rule.field = '7'
                req.rule.condition_value = '5'
                req.rule.condition ='contains'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 7 successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: '7',
                            field_value: 4590,
                            condition: 'contains',
                            condition_value: '5'
                        }
                    }
                })
            })

            test('array as the data type of the element at the specified field position', () => {
                req.rule.field = '6'
                req.rule.condition_value = 'java'
                req.rule.condition ='contains'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 6 successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                            error: false,
                            field: '6',
                            field_value: ['java', 'python', 'ruby'],
                            condition: 'contains',
                            condition_value: 'java'
                        }
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
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 2 failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: '2',
                            field_value: 'php',
                            condition: 'contains',
                            condition_value: 'java'
                        }
                    }
                })
            })

            test('number as the data type of the element at the specified field position', () => {
                req.rule.field = '7'
                req.rule.condition_value = 7
                req.rule.condition ='contains'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 7 failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: '7',
                            field_value: 4590,
                            condition: 'contains',
                            condition_value: 7
                        }
                    }
                })
            })

            test('array as the data type of the element at the specified field position with rule condition value also an array', () => {
                req.rule.field = '6'
                req.rule.condition_value = ['java', 'python', 'ruby']
                req.rule.condition ='contains'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 6 failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: '6',
                            field_value: ['java', 'python', 'ruby'],
                            condition: 'contains',
                            condition_value: ['java', 'python', 'ruby']
                        }
                    }
                })
            })

            test('array as the data type of the element at the specified field position with rule condition value as string or number', () => {
                req.rule.field = '6'
                req.rule.condition_value = 'C#'
                req.rule.condition ='contains'
                req.data = arr
                req = JSON.stringify(req)
                const new_val_ins = validationFxn(req)
                expect(new_val_ins.checkValidation()).toEqual({
                    message: `field 6 failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                            error: true,
                            field: '6',
                            field_value: ['java', 'python', 'ruby'],
                            condition: 'contains',
                            condition_value: 'C#'
                        }
                    }
                })
            })

        })
    })

})
