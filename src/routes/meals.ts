import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { checkAuthCookie } from "../middlewares/check-auth";

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/meals', { preHandler: [checkAuthCookie] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const MealRequestSchema = z.object({
      name: z.string().min(2, { message: "O nome da refeição deve conter no mínimo dois caracteres" }),
      description: z.string().min(2, { message: "A descrição da refeição deve conter no mínimo dois caracteres" }),
      mealDate: z.string().datetime({ message: "Formato de data inválido" })
      .transform((val) => new Date(val).getTime()),
      onDiet: z.boolean(),
    })

    const { mealDate } = MealRequestSchema.parse(request.body)
  })
}