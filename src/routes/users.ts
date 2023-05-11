import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'
import { knex } from "../database";
import { randomUUID } from 'node:crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const UserRegisterSchema = z.object({
      name: z.string().min(2, { message: "Seu nome deve possui no mínimo 2 letras" }),
      email: z.string().email({ message: "E-mail inválido" }),
      password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
      confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'As senhas devem ser iguais',
      path: ["confirmPassword"]
    })

    const { name, email, password } = UserRegisterSchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password
    })

    return reply.status(201).send()
    
  })
}