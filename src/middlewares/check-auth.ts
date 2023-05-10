import { FastifyReply, FastifyRequest } from "fastify";

export async function checkAuthCookie(request: FastifyRequest, reply: FastifyReply) {
  const { authCookie } = request.cookies

  if (!authCookie) {
    reply.status(401).send({
      error: 'Unauthorized'
    })
  }
}