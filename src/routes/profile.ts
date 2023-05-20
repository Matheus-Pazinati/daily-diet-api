import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { checkAuthCookie } from "../middlewares/check-auth";
import { knex } from "../database";

export async function profileRoutes(app: FastifyInstance) {
  app.get('/profile', {preHandler: [checkAuthCookie]}, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.cookies.AuthCookie

    const userMeals = await knex('meals').where({
      user_id: userId
    })
    .select()

    const mealsOnDiet = userMeals.filter((meal) => {
      return meal.on_diet == true
    })

    const mealsOutDiet = userMeals.filter((meal) => {
      return meal.on_diet == false
    })

    const profileStatus = {
      mealsAmount: userMeals.length,
      mealsOnDiet: mealsOnDiet.length,
      mealsOutDiet: mealsOutDiet.length
    }

    reply.status(200).send(profileStatus)
  })
}