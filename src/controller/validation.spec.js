const { validationController } = require('./');
const makeFakeRequest = require('../../__test__/makeRequest');

let req

beforeEach(() => {
    req = makeFakeRequest({})
})

test('should return status 200', () => {
    req.data.missions.count = 35
    const res = validationController(req)
    expect(res).toHaveProperty('headers')
    expect(res).toHaveProperty('statusCode', 200)
    expect(res).toHaveProperty('body')
    expect(res.body.message).toBe('field missions.count successfully validated.')
})

test('should return status 400', () => {
    req.data.missions.count = 20
    const res = validationController(req)
    expect(res).toHaveProperty('headers')
    expect(res).toHaveProperty('statusCode', 400)
    expect(res).toHaveProperty('body')
    expect(res.body.message).toBe('field missions.count failed validation.')
})