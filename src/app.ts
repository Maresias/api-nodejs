import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

app.addHook('preHandler', async (request, reply) => {
  console.log(`${request.method} ${request.url} ${reply.status(201).send()}`)
})

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
