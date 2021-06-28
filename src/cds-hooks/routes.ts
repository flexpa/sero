import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getService } from ".";
import Config from "../config";

function addCorsHeaders(reply: FastifyReply): void {
	reply.header("Access-Control-Allow-Origin", "*");
	reply.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function validateHookRequest(hookRequest: CDSHooks.HookRequest<Record<string, any>>, reply: FastifyReply): boolean {
	return true
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

		const hookRequest = request.body as CDSHooks.HookRequest<Record<string, string>>;
		const valid = validateHookRequest(hookRequest, reply);

		if (!valid) return

		const service = getService(options?.services || [], request.params.id);
		const response = service?.fn(hookRequest);

		reply.send(response);
	}
}

/**
 * Responsible for accepting feedback requests as defined by the protocol
 *
 * @param options
 */
 function feedback(options: Config["cdsHooks"]) {
	return (request: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) => {
		if (options?.cors) addCorsHeaders(reply);

		const feedback = request.body as CDSHooks.Feedback;


		reply.send()
	}
}

const hookRequestSchema = {
	body: {
		type: 'object',
		required: ['hook', 'hookInstance', 'context'],
		properties: {
			hook: { type: 'string' },
			hookInstance: { type: 'string' },
			fhirServer: { type: 'string' },
			fhirAuthorization: { type: 'object' },
			context: { type: 'object' },
			prefetch: { type: 'object' }
		}
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
		handler: invoke(options)
	})

	http.route({
		method: 'POST',
		url: '/cds-services/:id/feedback',
		schema: feedbackSchema,
		handler: feedback
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