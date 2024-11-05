import { DateTime } from 'luxon'
import Customer from '#models/order'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @hasMany(() => Customer)
  declare customers: HasMany<typeof Customer>

  @column()
  declare customer_id: number | null

  @column()
  declare totalAmount: string

  @column()
  declare orderDate: Date

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
