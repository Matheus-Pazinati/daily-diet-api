import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    console.log(request.body)
    reply.status(201).send()
  })
}