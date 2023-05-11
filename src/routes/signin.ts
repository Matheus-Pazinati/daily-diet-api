import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function signIn(app: FastifyInstance) {
  app.post('/signin', async (request: FastifyRequest, reply: FastifyReply) => {
    const UserAuthSchema = z.object({
      email: z.string().email({ message: "E-mail inválido" }),
      password: z.string()
    })

    const { email, password } = UserAuthSchema.parse(request.body)

    const user = await knex('users').where({
      email,
      password
    })
    .select()
    .first()

    if (user !== undefined) {
      reply.setCookie('AuthCookie', user.id, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days
      })
    } else {
      reply.status(401).send()
    }
    
  })
}