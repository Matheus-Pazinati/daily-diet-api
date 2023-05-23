import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Meals and user routes', () => {
  beforeAll( async () => {
    await app.ready()
  })

  afterAll( async () => {
    await app.close()
  })

  beforeEach( async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should create a user', async () => {
    await request(app.server)
    .post('/users')
    .send({
      name: "Matheus",
      email: "matheus@email.com",
      password: "123456",
      confirmPassword: "123456"
    })
    .expect(201)
  })

  it('should sign in user', async () => {
    await request(app.server)
    .post('/users')
    .send({
      name: "Pedro",
      email: "pedro@email.com",
      password: "123456",
      confirmPassword: "123456"
    })

    await request(app.server)
    .post('/signin')
    .send({
      email: "pedro@email.com",
      password: "123456"
    })
    .expect(200)
  })

  it("should create a meal", async () => {
    await request(app.server)
    .post('/users')
    .send({
      name: "Matheus",
      email: "matheus@email.com",
      password: "123456",
      confirmPassword: "123456"
    })

    const signedUser = await request(app.server)
    .post('/signin')
    .send({
      email: "matheus@email.com",
      password: "123456"
    })

    const authCookie = signedUser.headers['set-cookie']

    await request(app.server)
    .post('/meals')
    .set("Cookie", authCookie)
    .send({
      name: "Macarrão",
      description: "Macarrão pizza",
      mealDate: "2023-05-04T15:00:00Z",
      onDiet: false
    })
    .expect(201)
  })

  it("should list all meals", async () => {
    await request(app.server)
    .post('/users')
    .send({
      name: "Matheus",
      email: "matheus@email.com",
      password: "123456",
      confirmPassword: "123456"
    })

    const signedUser = await request(app.server)
    .post('/signin')
    .send({
      email: "matheus@email.com",
      password: "123456"
    })

    const authCookie = signedUser.headers['set-cookie']

    await request(app.server)
    .post('/meals')
    .set("Cookie", authCookie)
    .send({
      name: "Macarrão",
      description: "Macarrão pizza",
      mealDate: "2023-05-04T15:00:00Z",
      onDiet: false
    })

    const mealsResponse = await request(app.server)
    .get('/meals')
    .set("Cookie", authCookie)
    
    expect(mealsResponse.body).toEqual([
      expect.objectContaining({
        name: "Macarrão",
        description: "Macarrão pizza"
      })
    ])
  })
})