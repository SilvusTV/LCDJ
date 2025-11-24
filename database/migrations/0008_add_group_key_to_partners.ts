import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'partners'

  async up() {
    const hasColumn = await this.schema.hasColumn(this.tableName, 'group_key')
    if (hasColumn) return

    this.schema.alterTable(this.tableName, (table) => {
      table.string('group_key').nullable().index()
    })
  }

  async down() {
    const hasColumn = await this.schema.hasColumn(this.tableName, 'group_key')
    if (!hasColumn) return
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('group_key')
    })
  }
}
