import fastify from 'fastify'
import { capabilities, batch, read, vread, update, patch, destroy, history, create, search } from './routes/operations'

interface IConfig {
  store?: "memory";
}

export default (config: IConfig = {}) => {
  const http = fastify()

  // Whole System Interactions

  // Get a capability statement for the system
  http.route({
    method: 'GET',
    url: '/metadata',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          mode: {
            type: 'string',
            enum: ['full', 'normative', 'terminology'],
            default: 'full'
          }
        }
      },
    },
    handler: capabilities
  })

  // Update, create or delete a set of resources in a single interaction
  http.route({
    method: 'POST',
    url: '/',
    handler: batch
  })

  const resourceList = ["Patient"]
  // Instance Level Interactions
  resourceList.forEach((resource) => {
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
  })

  // Type Level Interactions
  resourceList.forEach((resource) => {
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
  })

  http.listen(8080, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })

  return http;
}