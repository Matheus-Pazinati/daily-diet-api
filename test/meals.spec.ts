import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Meals and user routes', () => {

  async function createUser() {
    const user = await request(app.server)
    .post('/users')
    .send({
      name: "Matheus",
      email: "matheus@email.com",
      password: "123456",
      confirmPassword: "123456"
    })
    return user
  }

  async function signInUserCookie() {
    const signedUser = await request(app.server)
    .post('/signin')
    .send({
      email: "matheus@email.com",
      password: "123456"
    })

    const authCookie = signedUser.headers['set-cookie']
    return authCookie
  }

  async function createMeal(cookie: string) {
    const meal =  await request(app.server)
    .post('/meals')
    .set("Cookie", cookie)
    .send({
      name: "Macarrão",
      description: "Macarrão pizza",
      mealDate: "2023-05-04T15:00:00Z",
      onDiet: false
    })

    return meal
  }

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
    const createUserRequest = await createUser()
    expect(createUserRequest.status).toBe(201)
  })

  it.only('should not create a user with same emails', async () => {
    await createUser()
    
    expect((await createUser()).status).toBe(500)
  })

  it('should sign in user', async () => {
    const user = {
      name: "Pedro",
      email: "pedro@email.com",
      password: "123456",
      confirmPassword: "123456"
    }
    await request(app.server)
    .post('/users')
    .send(user)

    await request(app.server)
    .post('/signin')
    .send({
      email: "pedro@email.com",
      password: "123456"
    })
    .expect(200)
  })

  it("should create a meal", async () => {
    createUser()
    const authCookie = await signInUserCookie()

    const meal = await createMeal(authCookie)

    expect(meal.status).toBe(201)
  })

  it("should list all meals", async () => {
    createUser()
    const authCookie = await signInUserCookie()

    createMeal(authCookie)

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

  it("should list a meal", async () => {
    createUser()
    const authCookie = await signInUserCookie()

    createMeal(authCookie)

    const mealsResponse = await request(app.server)
    .get('/meals')
    .set("Cookie", authCookie)

    const mealId = mealsResponse.body[0].id

    const mealResponse = await request(app.server)
    .get(`/meals/${mealId}`)
    .set("Cookie", authCookie)

    expect(mealResponse.body).toEqual(
      expect.objectContaining({
        name: "Macarrão",
        description: "Macarrão pizza"
      })
    )
  })

  it("should update a meal", async () => {
    createUser()
    const authCookie = await signInUserCookie()

    createMeal(authCookie)

    const mealsResponse = await request(app.server)
    .get('/meals')
    .set("Cookie", authCookie)

    const mealId = mealsResponse.body[0].id

    await request(app.server)
    .put(`/meals/${mealId}`)
    .send({
      name: "Pizza",
      description: "Rodízio de pizza"
    })
    .set("Cookie", authCookie)
    .expect(204)
  })

  it("should delete a meal", async () => {
    createUser()
    const authCookie = await signInUserCookie()

    createMeal(authCookie)

    const mealsResponse = await request(app.server)
    .get('/meals')
    .set("Cookie", authCookie)

    const mealId = mealsResponse.body[0].id

    await request(app.server)
    .delete(`/meals/${mealId}`)
    .set("Cookie", authCookie)
    .expect(204)
  })

  it("should list user status", async () => {
    createUser()
    const authCookie = await signInUserCookie()

    await request(app.server)
    .post('/meals')
    .set("Cookie", authCookie)
    .send({
      name: "Macarrão",
      description: "Macarrão pizza",
      mealDate: "2023-05-04T15:00:00Z",
      onDiet: false
    })

    await request(app.server)
    .post('/meals')
    .set("Cookie", authCookie)
    .send({
      name: "Salada",
      description: "Salade de folhas",
      mealDate: "2023-05-04T15:00:00Z",
      onDiet: true
    })

    const profileStatus = await request(app.server)
    .get("/profile")
    .set("Cookie", authCookie)

    expect(profileStatus.body).toEqual(
      expect.objectContaining({
        mealsAmount: 2,
        mealsOnDiet: 1,
        mealsOutDiet: 1
      })
    )
  })
})