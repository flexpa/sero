import { FastifyInstance } from "fastify"
import Config from "../../config"

async function handler() {
  throw new Error("Not Implemented");
}

export function interactions(_config: Config, http: FastifyInstance): void {
  // Batch support
  http.route({
    method: 'POST',
    url: '/',
    handler: handler
  })
}