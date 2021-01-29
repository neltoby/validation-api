const faker = require('faker')

module.exports = function (overrides){
    const req = {
        rule: {
            field: "missions.count",
            condition: "gte",
            condition_value: 30
          },
        data: {
            name: faker.name.findName(),
            crew: faker.name.jobDescriptor(),
            age: faker.random.number(),
            position: faker.name.jobTitle(),
            missions: {
                count: faker.random.number(),
                successful: faker.random.number(),
                failed: faker.random.number()
            }
        }
    }
    return {
        ...req,
        ...overrides
    }
}