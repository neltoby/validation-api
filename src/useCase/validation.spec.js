const { makeValidation } = require('./');
const makeFakeRequest = require('../../__test__/makeRequest');

test('should return an object', () => {
    let req = makeFakeRequest({})
    req.data.missions.count = 35
    const res = makeValidation(req)
    expect(res).toHaveProperty('message', 'field missions.count successfully validated.')
    expect(res).toHaveProperty('status', 'success')
    expect(res).toHaveProperty('data')
})