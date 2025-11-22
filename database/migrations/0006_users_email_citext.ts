import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    // Enable citext extension (idempotent)
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS citext')

    // Drop existing unique constraint to avoid conflicts during type change
    this.schema.raw('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_unique')

    // Normalize existing emails to lowercase to prevent duplicates after CITEXT
    this.schema.raw('UPDATE users SET email = LOWER(email)')

    // Change column type to CITEXT (case-insensitive text)
    this.schema.alterTable(this.tableName, (table) => {
      table.specificType('email', 'citext').notNullable().alter()
    })

    // Recreate unique index (now case-insensitive due to CITEXT)
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['email'])
    })
  }

  async down() {
    // Drop the unique constraint (will be recreated by original migration if needed)
    this.schema.raw('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_unique')

    // Revert column to string/varchar
    this.schema.alterTable(this.tableName, (table) => {
      table.string('email').notNullable().alter()
    })

    // Recreate unique index on email (case-sensitive again)
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['email'])
    })

    // Note: We do not drop the CITEXT extension in `down`, as it may be used elsewhere.
  }
}
