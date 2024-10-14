import { it, expect, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transaction route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.skip('should be able te create a new transaction', async () => {
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
})
