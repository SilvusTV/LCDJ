import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'partners'

  async up() {
    const exists = await this.schema.hasTable(this.tableName)
    if (exists) return

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('url').nullable()
      table.string('logo_url').nullable()
      table.integer('sort_order').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
