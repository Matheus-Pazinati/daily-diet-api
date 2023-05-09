import fastify from "fastify";
import cookies from '@fastify/cookie'
import { usersRoutes } from "./routes/users";

export const app = fastify()

app.register(cookies)
app.register(usersRoutes)
