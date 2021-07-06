import { Service } from "./index";
// @todo - should try to deliberately unify/install ajv version to match fastify at all times
import Ajv, { ValidateFunction, ErrorObject } from "@fastify/ajv-compiler/node_modules/ajv";
import { Hooks } from "./index"

/**
 * Validates that the hook request dynmically (depending on the hook and service at runtime):
 * 	 - has a validContext
 *   - has a validPrefetch
 *
 * @param hookRequest
 * @param reply
 * @returns Error | undefined
 */
export function validateHookRequest(hookRequest: CDSHooks.HookRequest<Record<string, any>>, service: Service): Error | undefined {
  // @ts-ignore
  const context = validateContext(hookRequest, hookRequest.hook);
  const prefetch = validatePrefetch(hookRequest, service);

  if (context.errors) {
    const error = schemaErrorFormatter(context.errors, 'body.context')
    // @ts-ignore
    error.validation = context.errors;
    // @ts-ignore
    error.validationContext = 'body.context'

    return error
  }

  if (prefetch.errors) {
    const error = schemaErrorFormatter(prefetch.errors, 'body')
    // @ts-ignore
    error.validation = prefetch.errors;
    // @ts-ignore
    error.validationContext = 'body'

    return error
  }
}

function schemaErrorFormatter(errors: ErrorObject[], dataVar: string) {
  let text = ''
  const separator = ', '

  for (var i = 0; i !== errors.length; ++i) {
    const e = errors[i]
    // @ts-ignore
    text += dataVar + (e.dataPath || '') + ' ' + e.message + separator
  }
  return new Error(text.slice(0, -separator.length))
}

function validatePrefetch(request: CDSHooks.HookRequest<Record<string, any>>, service: Service): ValidateFunction {
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
      let properties: Record<string, any> = {}

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

function validateContext(request: CDSHooks.HookRequest<Record<string, any>>, hook: Hooks): ValidateFunction {
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
          required: ['userId', 'patientId', 'selections', 'draftOrders'],
          properties: {
            userId: { type: 'string' },
            patientId: { type: 'string' },
            encounterId: { type: 'string' },
            selections: { type: 'array' },
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