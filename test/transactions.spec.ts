import { it, expect, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transaction route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able te create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'Transaction test',
      amount: 3000,
      type: 'credit',
    })
    expect(response.statusCode).toEqual(201)
  })

  it('should be able te list all transaction', async () => {
    const creatTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Transaction test all',
        amount: 5000,
        type: 'credit',
      })
    const cookies = creatTransactionResponse.get('Set-Cookie') ?? []
    const listTransactionRespose = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionRespose.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Transaction test all',
        amount: 5000,
      }),
    ])
  })

  it('should be able te get specific transaction ', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Specific transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie') ?? []

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionResponse.body.transactions[0].id

    const specificTransaction = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(specificTransaction.body.transaction).toEqual(
      expect.objectContaining({
        title: 'Specific transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able te get summary transactions ', async () => {
    const creatTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'debit transaction',
        amount: 5000,
        type: 'debit',
      })
      .expect(201)

    const cookies = creatTransactionResponse.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'credit transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)

    const summaryTransactionResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryTransactionResponse.body.summary).toEqual({
      amount: 0,
    })
  })
})
