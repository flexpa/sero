import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import Config from "../../config"

async function handler(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}

export function batch(config: Config, http: FastifyInstance) {
  http.route({
    method: 'POST',
    url: '/',
    handler: handler
  })
}