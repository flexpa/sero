import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import Config from "../../config"

const version = "0.0.0"
const name = "Sero Server Conformance Statement"

const CapabilityStatement: fhir4.CapabilityStatement =  {
  resourceType: "CapabilityStatement",
  status: "draft",
  publisher: "Automate Medical Inc.",
  kind: "instance",
  name,
  date: (new Date()).toString(),
  software: {
    name: "Sero",
    version
  },
  implementation: {
    description: "FHIR Server"
  },
  fhirVersion: "4.0.1",
  version,
  format: [
    "application/fhir+json"
  ],
  patchFormat: [
    "application/fhir+json"
  ],
  rest: [{
    extension: [],
    interaction: [],
    mode: "server",
    operation: [],
    resource: []
  }],
  experimental: true,
  copyright: "Copyright Automate Medical Inc. Licensed under the terms of the [Apache Software License 2.0](https://www.apache.org/licenses/LICENSE-2.0)."
}

const TerminologyCapabilities: fhir4.TerminologyCapabilities = {
  resourceType: "TerminologyCapabilities",
  date: (new Date()).toString(),
  kind: "capability",
  status: "draft",
  version,
  name,
  codeSystem: []
}

async function capabilities(request: FastifyRequest, reply: FastifyReply) {
  // @ts-expect-error
  switch (request.query.mode) {

    case "normative":
      // the entirety of the capability statement is normative today
      reply.send(CapabilityStatement)
      break;

    case "terminology":
      reply.send(TerminologyCapabilities)
      break;

    default:
      // default is to send the full statement
      reply.send(CapabilityStatement)
      break;
  }
}

export function capabilityStatement(config: Config, http: FastifyInstance): void {
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
}