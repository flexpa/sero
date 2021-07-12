import { FastifyInstance } from "fastify"
import Config from "../../config";
import Resources from "../../resources";

import { defaultRestReourceCapability, RestResourceCapability } from "../capabilities";

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

async function historyInstance() {
  throw new Error("Not Implemented");
}

async function search() {
  throw new Error("Not Implemented");
}

async function create() {
  throw new Error("Not Implemented");
}

async function historyType() {
  throw new Error("Not Implemented");
}

function hasInteraction(interaction: 'read' | 'vread' | 'update' | 'patch' | 'delete' | 'history-instance' | 'history-type' | 'create' | 'search-type', resource: Resources, config: Config) {
  const hasOverride = config.rest && Object.prototype.hasOwnProperty.call(config.rest.restResourceCapabilities, resource as unknown as string);

  if (hasOverride) {
    return config.rest?.restResourceCapabilities[resource].interaction?.includes({ code: interaction });
  } else {
    return defaultRestReourceCapability.interaction?.includes({ code: interaction });
  }
}

export function resources(config: Config, http: FastifyInstance): void {
  for (const resource in Resources) {
    // Read the current state of the resource
    if (hasInteraction('read', resource as Resources, config)) {
      http.route({
        method: 'GET',
        url: `/${resource}/:id`,
        handler: read
      })
    }

    // Read the state of a specific version of the resource
    if (hasInteraction('vread', resource as Resources, config)) {
      http.route({
        method: 'GET',
        url: `/${resource}/:id/_history/:vid`,
        handler: vread
      })
    }

    // Update an existing resource by its id (or create it if it is new)
    if (hasInteraction('update', resource as Resources, config)) {
      http.route({
        method: 'PUT',
        url: `/${resource}/:id`,
        handler: update
      })
    }

    // Update an existing resource by posting a set of changes to it
    if (hasInteraction('patch', resource as Resources, config)) {
      http.route({
        method: 'PATCH',
        url: `/${resource}/:id`,
        handler: patch
      })
    }

    // Delete a resource
    if (hasInteraction('delete', resource as Resources, config)) {
      http.route({
        method: 'DELETE',
        url: `/${resource}/:id`,
        handler: destroy
      })
    }

    // Retrieve the change history for a particular resource
    if (hasInteraction('history-instance', resource as Resources, config)) {
      http.route({
        method: 'GET',
        url: `/${resource}/:id/_history`,
        handler: historyInstance
      })
    }

    // Create a new resource with a server assigned id
    if (hasInteraction('create', resource as Resources, config)) {
      http.route({
        method: 'POST',
        url: `/${resource}`,
        handler: create
      })
    }

    // Search the resource type based on some filter criteria
    if (hasInteraction('search-type', resource as Resources, config)) {
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
    }

    if (hasInteraction('history-type', resource as Resources, config)) {
      // Retrieve the change history for a particular resource type
      http.route({
        method: 'GET',
        url: `/${resource}/_history`,
        handler: historyType
      })
    }
  }
}