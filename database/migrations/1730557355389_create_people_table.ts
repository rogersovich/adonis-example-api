import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'people'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('full_name').nullable()
      table.integer('age').nullable()
      table.enu('status', ['Alive', 'Dead', 'Unknown']).nullable()
      table.string('image').nullable()
      table.string('gender').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
