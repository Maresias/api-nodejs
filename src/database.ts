import { knex as setupKenx, Knex } from 'knex'

if (!process.env.DATABASE_URL) {
  throw new Error('DTABASE_URL not found')
}

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKenx(config)
