import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getService } from ".";
import Config from "../config";
import { validateHookRequest } from "./util";

/**
 * @deprecated
 * @param reply
 */
function addCorsHeaders(reply: FastifyReply): void {
	reply.header("Access-Control-Allow-Origin", "*");
	reply.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

/**
 * Responsible for validating the HookRequest, finding the service, and calling it
 * - or appropriately responding with and error
 *
 * @remarks This function is expected to increase in complexity significantly if
 * we support the delegated FHIR Resource Access workflow.
 *
 * @todo FHIR Resource Access workflow?
 *
 * @param options
 */
function invoke(options: Config["cdsHooks"]) {
	return (request: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) => {
		if (options?.cors) addCorsHeaders(reply);

		if (request.validationError) console.log(request.validationError)

		const service = getService(options?.services || [], request.params.id);

		if (!service) {
			reply.statusCode = 404;
			reply.send();
		} else {
			const hookRequest = request.body as CDSHooks.HookRequest<Record<string, string>>;
			const valid = validateHookRequest(hookRequest, service);

			if (!valid) {
				reply.statusCode = 400;
				reply.send({ error: 'bad' })
			} else {
				const response = service.fn(hookRequest);
				reply.send(response);
			}
		}
	}
}

/**
 * Responsible for accepting feedback requests as defined by the protocol. Logs the request
 * but doesn't otherwise process or validate it.
 *
 * @todo validate that the feedback has referrential integrity to some original HookRequest
 *
 * @param options
 */
 function feedback(options: Config["cdsHooks"]) {
	return (request: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) => {
		if (options?.cors) addCorsHeaders(reply);

		const feedback = request.body as CDSHooks.Feedback;

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
		// Pattern from https://stackoverflow.com/questions/38717933/jsonschema-attribute-conditionally-required/38781027#38781027
		oneOf: [
			{
				properties: {
					hook: { const: 'appointment-book' },
					context: {
						type: 'object',
						required: ['userId', 'patientId', 'appointments'],
						properties: {
							userId: { type: 'string' },
							patientId: { type: 'string' },
							appointments: { type: 'object' },
							encounterId: { type: 'string' }
						}
					}
				}
			},
			{
				properties: {
					hook: { const: 'encounter-discharge' },
					context: {
						type: 'object',
						required: ['userId', 'patientId', 'encounterId'],
						properties: {
							userId: { type: 'string' },
							patientId: { type: 'string' },
							encounterId: { type: 'string' }
						}
					}
				}
			},
			{
				properties: {
					hook: { const: 'encounter-start' },
					context: {
						type: 'object',
						required: ['userId', 'patientId', 'encounterId'],
						properties: {
							userId: { type: 'string' },
							patientId: { type: 'string' },
							encounterId: { type: 'string' }
						}
					}
				}
			},
			{
				properties: {
					hook: { const: 'medication-prescribe' },
					context: {
						type: 'object',
						required: ['userId', 'patientId'],
						properties: {
							userId: { type: 'string' },
							patientId: { type: 'string' },
							encounterId: { type: 'string' },
							medications: { type: 'object' },
						}
					}
				}
			},
			{
				properties: {
					hook: { const: 'order-review' },
					context: {
						type: 'object',
						required: ['userId', 'patientId', 'orders'],
						properties: {
							userId: { type: 'string' },
							patientId: { type: 'string' },
							encounterId: { type: 'string' },
							orders: { type: 'object' },
						}
					}
				}
			},
			{
				properties: {
					hook: { const: 'order-select' },
					context: {
						type: 'object',
						required: ['userId', 'patientId', 'selections', 'draftOrders'],
						properties: {
							userId: { type: 'string' },
							patientId: { type: 'string' },
							encounterId: { type: 'string' },
							selections: { type: 'array' },
							draftOrders: { type: 'object' }
						}
					}
				}
			},
			{
				properties: {
					hook: { const: 'order-sign' },
					context: {
						type: 'object',
						required: ['userId', 'patientId', 'draftOrders'],
						properties: {
							userId: { type: 'string' },
							patientId: { type: 'string' },
							encounterId: { type: 'string' },
							draftOrders: { type: 'object' }
						}
					}
				}
			},
			{
				properties: {
					hook: { const: 'patient-view' },
					context: {
						type: 'object',
						required: ['userId', 'patientId'],
						properties: {
							userId: { type: 'string' },
							patientId: { type: 'string' },
							encounterId: { type: 'string' }
						}
					}
				}
			}
		]
	}
}

const feedbackSchema = {
	body: {
		type: 'object',
		required: ['card', 'outcome'],
		properties: {
			card: { type: 'string' },
			outcome: { type: 'string' },
			acceptedSuggestions: { type: 'string' },
			overrideReason: { type: 'object' },
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
export default (http: FastifyInstance, options: Config["cdsHooks"]) => {
	http.route({
		method: 'GET',
		url: '/cds-services',
		handler: (request, reply) => {
			if (options?.cors) addCorsHeaders(reply);

			reply.send({
				services: options?.services || []
			})
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
			handler: (request, reply) => {
				addCorsHeaders(reply);
				reply.send();
			}
		})

		http.route({
			method: 'OPTIONS',
			url: '/cds-services/:id',
			handler: (request, reply) => {
				addCorsHeaders(reply);
				reply.send();
			}
		})
	}
}