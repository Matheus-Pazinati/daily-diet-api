import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { checkAuthCookie } from "../middlewares/check-auth";
import { knex } from "../database";
import { randomUUID } from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/meals', { preHandler: [checkAuthCookie] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const MealRequestSchema = z.object({
      name: z.string().min(2, { message: "O nome da refeição deve conter no mínimo dois caracteres" }),
      description: z.string().min(2, { message: "A descrição da refeição deve conter no mínimo dois caracteres" }),
      mealDate: z.string().datetime({ message: "Formato de data inválido" })
      .transform((val) => new Date(val).getTime()),
      onDiet: z.boolean(),
    })

    const { name, description, mealDate, onDiet } = MealRequestSchema.parse(request.body)

    const userId = request.cookies.AuthCookie

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      meal_date: mealDate,
      on_diet: onDiet,
      user_id: userId
    })

    reply.status(201).send()
  })

  app.get('/meals', { preHandler: [checkAuthCookie] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.cookies.AuthCookie

    const meals = await knex('meals')
    .where({
      user_id: userId
    })
    .select()

    reply.status(200).send(meals)
  })
}