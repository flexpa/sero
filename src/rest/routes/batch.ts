import { FastifyInstance } from "fastify"
import Config from "../../config"

async function handler() {
  throw new Error("Not Implemented");
}

export function batch(_config: Config, http: FastifyInstance) {
  http.route({
    method: 'POST',
    url: '/',
    handler: handler
  })
}