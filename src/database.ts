import { knex as setupKenx } from 'knex'

export const knex = setupKenx({
  client: 'sqlite3',
  connection: {
    filename: './tmp/app.db',
  },
})
