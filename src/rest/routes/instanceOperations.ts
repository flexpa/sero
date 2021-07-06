import { FastifyInstance } from "fastify"
import Config from "../../config";
import Resources from "../../resources";

async function read() {
  throw new Error("Not Implemented");
}

async function vread() {
  throw new Error("Not Implemented");
}

async function update() {
  throw new Error("Not Implemented");
}

async function patch() {
  throw new Error("Not Implemented");
}

async function destroy() {
  throw new Error("Not Implemented");
}

async function history() {
  throw new Error("Not Implemented");
}

export function instanceOperations(_config: Config, http: FastifyInstance): void {
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