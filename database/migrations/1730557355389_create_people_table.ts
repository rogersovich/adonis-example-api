import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'people'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('full_name', 255).nullable()
      table.integer('age', 10).nullable()
      table.string('status', 50).nullable()
      table.string('image', 255).nullable()
      table.string('gender', 50).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
