import Order from '#models/order';
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker';

export default class extends BaseSeeder {
  async run() {
    for (let i = 0; i < 50; i++) {
      const order_date = faker.date.past()
      const customer_id = faker.helpers.arrayElement([i + 1, null])
      await Order.create({
        customer_id: customer_id,
        totalAmount: faker.finance.amount(),
        orderDate: order_date,
      });
    }
  }
}
