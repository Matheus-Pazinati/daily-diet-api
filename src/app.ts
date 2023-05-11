import fastify from "fastify";
import cookies from '@fastify/cookie'
import { usersRoutes } from "./routes/users";
import { signIn } from "./routes/signin";

export const app = fastify()

app.register(cookies)
app.register(usersRoutes)
app.register(signIn)
