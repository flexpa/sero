import { FastifyRequest, FastifyReply, FastifyPluginCallback } from "fastify"
import Resources from "../../resources.js";
import Store, { created } from "../store.js";

import { defaultRestReourceCapability } from "../capabilities.js";
import { randomUUID } from "crypto";
import { RestPluginConfig } from "../index.js";

export function read(resource: Resources) {
  return (request: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) => {
    const hasDocument = Store.getState().resources[resource].allIds.includes(request.params.id)

    if (!hasDocument) {
      reply.code(404).send()
    } else {
      const document = Store.getState().resources[resource].byId.find((e) => e.id == request.params.id)

      reply.send(document)
    }
  }
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

export function batchOrTransaction() {
  throw new Error("Not Implemented");
}

export function create(resource: Resources) {
  return (request: FastifyRequest, reply: FastifyReply) => {
    const attributes = request.body as fhir4.FhirResource;
    const id = randomUUID();
    const meta = {
      version: null,
      lastUpdated: (new Date()).toString(),
      ...attributes.meta
    }
    const document = { 
      id,
      meta,
      ...attributes
    } 

    Store.dispatch(created(document))

    reply
      .code(201)
      .header('Location', `/${resource}/${id}`)
      .send(document)
  }
}

async function historyType() {
  throw new Error("Not Implemented");
}

function hasInteraction(interaction: 'read' | 'vread' | 'update' | 'patch' | 'delete' | 'history-instance' | 'history-type' | 'create' | 'search-type', resource: Resources, config: RestPluginConfig) {
  const hasOverride = Object.prototype.hasOwnProperty.call(config.restResourceCapabilities, resource as string);

  if (hasOverride) {
    return config.restResourceCapabilities[resource].interaction?.some((i) => i.code == interaction);
  } else {
    return defaultRestReourceCapability.interaction?.some((i) => i.code == interaction);
  }
}

export const interactions: FastifyPluginCallback<RestPluginConfig> = function (http, config: RestPluginConfig, next) {
  for (const resource in Resources) {
    // Read the current state of the resource
    if (hasInteraction('read', resource as Resources, config)) {
      http.route({
        method: 'GET',
        url: `/${resource}/:id`,
        handler: read(resource as Resources)
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
        handler: create(resource as Resources)
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

  // Batch support
  http.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        required: ['resourceType', 'type'],
        properties: {
          resourceType: { const: 'Bundle' },
          type: { enum: ['batch', 'transaction'] }
        }
      }
    },
    handler: batchOrTransaction
  })

  next()
}