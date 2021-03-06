import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";
import Service from "./service.js";
import { Feedback } from "./card.js";
import { CDSHookRequest } from "./service.js";
import { validateHookRequest, getService, CDSNoDecisionResponse } from "./util.js";

/**
 * @deprecated This should be invoked some other way
 * @param reply -
 */
function addCorsHeaders(reply: FastifyReply): void {
  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

interface CDSServicePluginOptions {
	services: Service[];
	cors?: boolean;
}


/**
 * Responsible for validating the CDSHookRequest, finding the service, and calling it
 * - or appropriately responding with and error
 *
 * @remarks This function is expected to increase in complexity significantly if
 * we support the delegated FHIR Resource Access workflow.
 *
 * @todo FHIR Resource Access workflow?
 * @todo error handling response for step 4 (412)
 *
 * @param options -
 */
function invoke(options: CDSServicePluginOptions) {
  return async (request: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) => {

    if (options?.cors) addCorsHeaders(reply);
    const service = getService(options?.services || [], request.params.id);

    // 1. Is there actually a service??
    if (!service) {
      reply.code(404).send();
    }
    // 2. Is there a schema validation error already?
    else if (request.validationError) {
      reply.log.info("SchemaValidationError")
      reply.code(400).send(request.validationError);
    } else {
      const hookRequest = request.body as CDSHookRequest<Record<string, string>>;
      const validationError = validateHookRequest(hookRequest, service);

      // 3. Is there a dynamic validation error on this CDSHookRequest?
      if (validationError) {
        reply.log.info("HookRequestValidationError")
        reply.code(400).send(validationError)
      // 4. Otherwise execute the service
      } else {
        try {
          const response = await service.handler(hookRequest);
          reply.send(response);
        } catch (error) {
          if (error instanceof CDSNoDecisionResponse) {
            reply.log.info("NoDecisionResponse")
            reply.send({
              cards: []
            })
          } else {
            console.log(error)
            throw error;
          }
        }
      }
    }
  }
}

/**
 * Responsible for accepting feedback requests as defined by the protocol. Logs the request
 * but doesn't otherwise process or validate it.
 *
 * @todo validate that the feedback has referrential integrity to some original CDSHookRequest
 *
 * @param options -
 */
function feedback(options: CDSServicePluginOptions) {
  return (request: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) => {
    if (options?.cors) addCorsHeaders(reply);

    const feedback = request.body as Feedback;

    request.log.info('Feedback received', feedback);

    reply.send()
  }
}

const hookRequestSchema = {
  body: {
    type: 'object',
    required: ['hook', 'hookInstance', 'context'],
    properties: {
      hook: {
        type: 'string',
        enum: [
          'appointment-book',
          'encounter-discharge',
          'encounter-start',
          'medication-prescribe',
          'order-review',
          'order-select',
          'order-sign',
          'patient-view'
        ]
      },
      hookInstance: { type: 'string' },
      fhirServer: { type: 'string' },
      fhirAuthorization: { type: 'object' },
      context: { type: 'object' },
      prefetch: { type: 'object' }
    },
  }
}

const feedbackSchema = {
  body: {
    type: 'object',
    required: ['card', 'outcome'],
    properties: {
      card: { type: 'string' },
      outcome: { type: 'string' },
      acceptedSuggestions: { type: 'array' },
      overrideReason: {
        type: 'object',
        properties: {
          reason: { type: 'object' },
          userComment: { type: 'string' }
        }
      },
      outcomeTimestamp	: { type: 'string' },
    }
  }
}

/**
 * @remarks
 * Builds the routes necessary to serve CDS Services including the CDS Services discovery
 * route as well as service-specific invocation routes
 *
 * @param http - A fastify instance
 * @param options - The services and
 */
const oauthPlugin: FastifyPluginCallback<CDSServicePluginOptions> = function (http, options: CDSServicePluginOptions, next) {
  http.route({
    method: 'GET',
    url: '/cds-services',
    handler: (_request, reply) => {
      if (options?.cors) addCorsHeaders(reply);

      const response: DiscoveryResponse = {
        services: options?.services || []
      }
      reply.send(response)
    }
  })

  http.route({
    method: 'POST',
    url: '/cds-services/:id',
    schema: hookRequestSchema,
    attachValidation: true,
    handler: invoke(options)
  })

  http.route({
    method: 'POST',
    url: '/cds-services/:id/feedback',
    schema: feedbackSchema,
    handler: feedback(options)
  })

  if (options?.cors) {
    http.route({
      method: 'OPTIONS',
      url: '/cds-services',
      handler: (_request, reply) => {
        addCorsHeaders(reply);
        reply.send();
      }
    })

    http.route({
      method: 'OPTIONS',
      url: '/cds-services/:id',
      handler: (_request, reply) => {
        addCorsHeaders(reply);
        reply.send();
      }
    })
  }

  next();
}

export default fastifyPlugin(oauthPlugin, { name: "cds-services"})

/**
 * The response to the discovery endpoint SHALL be an object containing a list
 * of CDS Services.
 */
export interface DiscoveryResponse {
  /**
   * An array of CDS Services.
   */
  services: Service[]
}