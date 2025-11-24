import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Partner extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare url: string | null

  @column({ columnName: 'logo_url' })
  declare logoUrl: string | null

  @column({ columnName: 'sort_order' })
  declare sortOrder: number

  @column({ columnName: 'group_key' })
  declare key: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
