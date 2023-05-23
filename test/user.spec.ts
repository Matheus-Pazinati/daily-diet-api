import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('User routes', () => {
  beforeAll( async () => {
    await app.ready()
  })

  afterAll( async () => {
    await app.close()
  })

  beforeEach(async () => {
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
      name: "Matheus",
      email: "matheus@email.com",
      password: "123456",
      confirmPassword: "123456"
    })

    await request(app.server)
    .post('/signin')
    .send({
      email: "matheus@email.com",
      password: "123456"
    })
    .expect(200)
  })
})
