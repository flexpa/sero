import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import Config from "../../config";
import Resources from "../../resources";

async function search(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}
async function create(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}
async function history(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}

export function typeOperations(config: Config, http: FastifyInstance) {
  for (const resource in Resources) {
    // Create a new resource with a server assigned id
    http.route({
      method: 'POST',
      url: `/${resource}`,
      handler: create
    })
    // Search the resource type based on some filter criteria
    http.route({
      method: 'GET',
      url: `/${resource}/_search`,
      handler: search
    })
    // Support for POST-based search
    http.route({
      method: 'POST',
      url: `/${resource}/_search`,
      handler: search
    })
    // Retrieve the change history for a particular resource type
    http.route({
      method: 'GET',
      url: `/${resource}/_history`,
      handler: history
    })
  }
}