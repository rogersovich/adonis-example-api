import Person from '#models/person';
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker';

export default class extends BaseSeeder {
  async run() {
    for (let i = 0; i < 100; i++) {
      await Person.create({
        fullName: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 100 }),
        status: faker.helpers.arrayElement(['Alive', 'Dead', 'Unknown']),
        image: faker.image.avatar(),
        gender: faker.person.gender(),
      });
    }
  }
}
