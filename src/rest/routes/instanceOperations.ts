import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import Config from "../../config";
import Resources from "../../resources";

async function read(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}

async function vread(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}

async function update(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}

async function patch(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}

async function destroy(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}

async function history(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Not Implemented");
}

export function instanceOperations(config: Config, http: FastifyInstance) {
  for (const resource in Resources) {
     // Read the current state of the resource
     http.route({
      method: 'GET',
      url: `/${resource}/:id`,
      handler: read
    })
    // Read the state of a specific version of the resource
    http.route({
      method: 'GET',
      url: `/${resource}/:id/_history/:vid`,
      handler: vread
    })
    // Update an existing resource by its id (or create it if it is new)
    http.route({
      method: 'PUT',
      url: `/${resource}/:id`,
      handler: update
    })
    // Update an existing resource by posting a set of changes to it
    http.route({
      method: 'PATCH',
      url: `/${resource}/:id`,
      handler: patch
    })
    // Delete a resource
    http.route({
      method: 'DELETE',
      url: `/${resource}/:id`,
      handler: destroy
    })
    // 	Retrieve the change history for a particular resource
    http.route({
      method: 'GET',
      url: `/${resource}/:id/_history`,
      handler: history
    })
  }
}