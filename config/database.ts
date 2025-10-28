import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'pg',
  connections: {
    pg: {
      client: 'pg',
      connection: {
        host: env.get('PG_HOST', 'localhost'),
        port: env.get('PG_PORT', '5432'),
        user: env.get('PG_USER', 'postgres'),
        password: env.get('PG_PASSWORD', ''),
        database: env.get('PG_DB_NAME', 'lcdj')
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig