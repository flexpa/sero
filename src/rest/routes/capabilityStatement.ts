import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify"
import { RestPluginConfig } from "..";
import { CapabilityStatement, TerminologyCapabilities } from "../capabilities.js";

function capabilities(config: RestPluginConfig) {
  return (request: FastifyRequest<{ Querystring: { mode: string }}>, reply: FastifyReply) => {
    switch (request.query.mode) {
    case "normative":
      // the entirety of the capability statement is normative today
      reply.send(CapabilityStatement(config))
      break;

    case "terminology":
      reply.send(TerminologyCapabilities(config))
      break;

    default:
      // default is to send the full statement
      reply.send(CapabilityStatement(config))
      break;
    }
  }
}

export const capabilityStatement: FastifyPluginCallback<RestPluginConfig> = function (http, options, next) {
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
    handler: capabilities(options)
  })

  next()
}