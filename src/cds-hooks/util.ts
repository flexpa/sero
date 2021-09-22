import { CDSService } from "./index";
import Ajv from "ajv";
import { ValidateFunction, ErrorObject } from "ajv";
import { CDSHookRequest } from "./service";

/**
 * Validates that the hook request dynmically (depending on the hook and service at runtime):
 * 	 - has a validContext
 *   - has a validPrefetch
 *
 * @param hookRequest
 * @param reply
 * @returns Error | undefined
 */
export function validateHookRequest(hookRequest: CDSHookRequest<Record<string, unknown>>, service: CDSService): Error | undefined {
  // @ts-expect-error hookRequest.hook needs to be co-erced into the type...
  const context = validateContext(hookRequest, hookRequest.hook);
  const prefetch = validatePrefetch(hookRequest, service);

  if (context.errors) {
    const error = schemaErrorFormatter(context.errors, 'body.context')
    // @ts-expect-error Shape to trick fastify
    error.validation = context.errors;
    // @ts-expect-error Shape to trick fastify
    error.validationContext = 'body.context'

    return error
  }

  if (prefetch.errors) {
    const error = schemaErrorFormatter(prefetch.errors, 'body')
    // @ts-expect-error Shape to trick fastify
    error.validation = prefetch.errors;
    // @ts-expect-error shape to trick fastify
    error.validationContext = 'body'

    return error
  }
}

/**
 * Formats dynamic schema errors - mimics the defaultSchemaErrorFormatter from Fastify internals
 * (unfortunately not exported)
 *
 * @param errors
 * @param dataVar
 * @returns Error
 */
function schemaErrorFormatter(errors: ErrorObject[], dataVar: string) {
  let text = ''
  const separator = ', '

  for (let i = 0; i !== errors.length; ++i) {
    const e = errors[i]
    text += dataVar + (e.dataPath || '') + ' ' + e.message + separator
  }
  return new Error(text.slice(0, -separator.length))
}

/**
 *  
 * 
 * @param request 
 * @param service 
 * @returns 
 */
function validatePrefetch(request: CDSHookRequest<Record<string, any>>, service: CDSService): ValidateFunction {
  const ajv = new Ajv({
    removeAdditional: false,
    useDefaults: true,
    coerceTypes: true,
    allErrors: false
  })

  const prefetch = request.prefetch; 

  function prefetchFor(service: CDSService) {
    // Service expects prefetch and no prefetch was sent
    if (service.prefetch && prefetch == undefined) {
      return {
        type: 'object',
        required: ['prefetch'],
        properties: {
          prefetch: { type: 'object' }
        }
      }
    }
    // Service expects prefetch and it's present
    else if (service.prefetch && prefetch) {
      // eslint forces this into a const but the runtime never complains about the object assignemnt
      const properties: Record<string, any> = {}

      Object.keys(service.prefetch).forEach((key) => {
        // @todo not sure this is always actually an object...
        properties[key] = { type: 'object' }
      })

      return {
        type: 'object',
        required: ['prefetch'],
        properties: {
          prefetch: {
            type: 'object',
            required: Object.keys(service.prefetch),
            properties
          }
        }
      }
    } else {
      return { type: 'object' }
    }
  }

  const schema = prefetchFor(service)

  const compiled = ajv.compile(schema)
  compiled(request)
  return compiled
}

function validateContext(request: CDSHookRequest<Record<string, any>>, hook: Hooks): ValidateFunction {
  const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allErrors: false
  });

  const context = request.context

  function contextFor(hook: Hooks) {
    switch (hook) {
    case "appointment-book":
      return {
        type: 'object',
        required: ['userId', 'patientId', 'appointments'],
        properties: {
          userId: { type: 'string' },
          patientId: { type: 'string' },
          appointments: { type: 'object' },
          encounterId: { type: 'string' }
        }
      }
    case "encounter-discharge":
      return {
        type: 'object',
        required: ['userId', 'patientId', 'encounterId'],
        properties: {
          userId: { type: 'string' },
          patientId: { type: 'string' },
          encounterId: { type: 'string' }
        }
      };
    case "encounter-start":
      return {
        type: 'object',
        required: ['userId', 'patientId', 'encounterId'],
        properties: {
          userId: { type: 'string' },
          patientId: { type: 'string' },
          encounterId: { type: 'string' }
        }
      };
    case "medication-prescribe":
      return {
        type: 'object',
        required: ['userId', 'patientId'],
        properties: {
          userId: { type: 'string' },
          patientId: { type: 'string' },
          encounterId: { type: 'string' },
          medications: { type: 'object' },
        }
      };
    case "order-review":
      return {
        type: 'object',
        required: ['userId', 'patientId', 'orders'],
        properties: {
          userId: { type: 'string' },
          patientId: { type: 'string' },
          encounterId: { type: 'string' },
          orders: { type: 'object' },
        }
      };
    case "order-select":
      return {
        type: 'object',
        required: ['userId', 'patientId', 'draftOrders'],
        anyOf: [{
          required: ['userId', 'patientId', 'draftOrders', 'selections']
        }, {
          // support for Logica Sandbox not implementing this correctly
          required: ['userId', 'patientId', 'draftOrders', 'selection']
        }],
        properties: {
          userId: { type: 'string' },
          patientId: { type: 'string' },
          encounterId: { type: 'string' },
          selections: { type: 'array' },
          selection: { type: 'string' },
          draftOrders: { type: 'object' }
        }
      };
    case "order-sign":
      return {
        type: 'object',
        required: ['userId', 'patientId', 'draftOrders'],
        properties: {
          userId: { type: 'string' },
          patientId: { type: 'string' },
          encounterId: { type: 'string' },
          draftOrders: { type: 'object' }
        }
      };
    case "patient-view":
      return {
        type: 'object',
        required: ['userId', 'patientId'],
        properties: {
          userId: { type: 'string' },
          patientId: { type: 'string' },
          encounterId: { type: 'string' }
        }
      };
    }
  }

  const schema = contextFor(hook)

  const compiled = ajv.compile(schema)
  compiled(context)
  return compiled
}

export function getService(services: CDSService[], id: string): CDSService | undefined {
  return services.find((service) => service.id == id)
}

export class CDSNoDecisionResponse extends Error {}

export interface FhirAuthorization {
  /**
   * This is the OAuth 2.0 access token that provides access to the FHIR
   * server.
   */
  access_token: string

  token_type: 'Bearer'

  /**
   * The lifetime in seconds of the access token.
   */
  expires_in: number

  /**
   * The scopes the access token grants the CDS Service.
   */
  scope: string

  /**
   * The OAuth 2.0 client identifier of the CDS Service, as registered with the
   * CDS Client's authorization server.
   */
  subject: string
}

export type Hooks = "patient-view" | "order-sign" | "order-select" | "order-review" | "medication-prescribe" | "encounter-start" | "encounter-discharge" | "appointment-book"

export interface SystemAction {
  /**
   * The type of action being performed. Allowed values are: create, update, delete.
   */
  type: 'create' | 'update' | 'delete'

  /**
   * Human-readable description of the suggested action MAY be presented to the
   * end-user.
   */
  description: string

  /**
   * A FHIR resource. When the type attribute is create, the resource attribute
   * SHALL contain a new FHIR resource to be created. For update, this holds
   * the updated resource in its entirety and not just the changed fields. Use
   * of this field to communicate a string of a FHIR id for delete suggestions
   * is DEPRECATED and resourceId SHOULD be used instead.
   */
  resource?: any

  /**
   * A relative reference to the relevant resource. SHOULD be provided when the
   * type attribute is delete.
   */
  resourceId?: string
}