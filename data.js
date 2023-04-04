import { faker } from '@faker-js/faker'

const DATA_COUNT = 50

const DEPARTMENTS = ['Engineering', 'Management', 'Creative', 'Strategy']
const LOCATIONS = ['Boston', 'Los Angeles', 'Denver', 'Orlando', 'Houston', 'Portland']

const YEARS = [
    {
        label: '5 Years or less',
        range: [0, 1, 2, 3, 4, 5],
        value: '0-5'
    },
    {
        label: '6 - 10 Years',
        range: [6, 7, 8, 9, 10],
        value: '6-10'
    },
    {
        label: '11 - 15 Years',
        range: [11, 12, 13, 14, 15],
        value: '11-15'
    },
    {
        label: '16 - 20 Years',
        range: [16, 17, 18, 19, 20],
        value: '16-20'
    },
    {
        label: '20+ Years',
        range: [21, 22, 23, 24, 25],
        value: '20-25'
    },
]

const staffData = Array.from({ length: DATA_COUNT }, () => ({
    name: faker.name.fullName(),
    department: DEPARTMENTS[Math.floor(Math.random()*DEPARTMENTS.length)],
    years: faker.datatype.number({ min: 1, max: 25 }),
    location: LOCATIONS[Math.floor(Math.random()*LOCATIONS.length)],
    avatar: faker.image.cats(800, 800, true),
}))

export { staffData, DEPARTMENTS, LOCATIONS, YEARS }