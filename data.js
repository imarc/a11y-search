import { faker } from '@faker-js/faker'

const DATA_COUNT = 50

const DEPARTMENTS = ['Engineering', 'Management', 'Creative', 'Strategy']
const LOCATIONS = ['Boston', 'Los Angeles', 'Denver', 'Orlando', 'Houston', 'Portland']

const staffData = Array.from({ length: DATA_COUNT }, () => {
    return {
        name: faker.name.fullName(),
        department: DEPARTMENTS[Math.floor(Math.random()*DEPARTMENTS.length)],
        years: faker.datatype.number({ min: 1, max: 25 }),
        location: LOCATIONS[Math.floor(Math.random()*LOCATIONS.length)],
        avatar: faker.image.cats(800, 800, true),
    }
})

export { staffData, DEPARTMENTS, LOCATIONS }