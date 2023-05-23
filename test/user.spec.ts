import { describe, it, beforeAll, afterAll, expect, beforeEach } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

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
})
