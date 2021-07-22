import { Service } from "./index";
import Ajv from "ajv";
import { ValidateFunction, ErrorObject } from "ajv";
import { Hooks } from "./index"
import { HookRequest } from "./service";

/**
 * Validates that the hook request dynmically (depending on the hook and service at runtime):
 * 	 - has a validContext
 *   - has a validPrefetch
 *
 * @param hookRequest
 * @param reply
 * @returns Error | undefined
 */
export function validateHookRequest(hookRequest: HookRequest<Record<string, unknown>>, service: Service): Error | undefined {
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
function validatePrefetch(request: HookRequest<Record<string, any>>, service: Service): ValidateFunction {
  const ajv = new Ajv({
    removeAdditional: false,
    useDefaults: true,
    coerceTypes: true,
    allErrors: false
  })

  const prefetch = request.prefetch; 

  function prefetchFor(service: Service) {
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

function validateContext(request: HookRequest<Record<string, any>>, hook: Hooks): ValidateFunction {
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