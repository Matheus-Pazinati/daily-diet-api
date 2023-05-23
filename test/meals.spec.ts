import { describe, it, beforeAll, afterAll } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

describe('Meals routes', () => {
  beforeAll( async () => {
    await app.ready()
  })

  afterAll( async () => {
    await app.close()
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
})