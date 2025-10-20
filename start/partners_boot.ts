import db from '@adonisjs/lucid/services/db'

// Ensure the partners table exists (for SQLite dev without running migrations)
await db.connection().schema.hasTable('partners').then(async (exists) => {
  if (!exists) {
    await db.connection().schema.createTable('partners', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('url').nullable()
      table.string('logo_url').nullable()
      table.integer('sort_order').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(db.raw("(datetime('now'))"))
      table.timestamp('updated_at', { useTz: false }).nullable()
    })
  }
})
