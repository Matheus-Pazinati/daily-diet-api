import { FastifyReply, FastifyRequest } from "fastify";

export async function checkAuthCookie(request: FastifyRequest, reply: FastifyReply) {
  const { AuthCookie } = request.cookies

  if (!AuthCookie) {
    reply.status(401).send({
      error: 'Unauthorized'
    })
  }
}