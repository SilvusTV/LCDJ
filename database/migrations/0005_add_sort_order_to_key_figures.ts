import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'key_figures'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('sort_order').notNullable().defaultTo(0).index()
    })

    // Backfill existing rows with incremental sort_order based on created_at asc
    this.defer(async (db) => {
      const rows: Array<{ id: number }> = await db.from(this.tableName).select('id').orderBy('created_at', 'asc')
      for (let i = 0; i < rows.length; i++) {
        await db.from(this.tableName).where('id', rows[i].id).update({ sort_order: i })
      }
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('sort_order')
    })
  }
}
