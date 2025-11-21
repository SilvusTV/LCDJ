import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'pg',
  connections: {
    pg: {
      client: 'pg',
      connection: {
        host: env.get('PG_HOST', 'localhost'),
        // env.get returns a string, but 'port' expects a number
        port: parseInt(env.get('PG_PORT', '5432'), 10),
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