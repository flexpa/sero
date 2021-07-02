import { Service } from "./index";
import Ajv, { ValidateFunction, ErrorObject } from "ajv";
import { Hooks } from "./index"

/**
 * Validates that the hook request:
 * 	 - Is for a real service
 *   - Meets the input requirements
 *   - ???
 *
 * @todo not actually implemented and return value should be the service maybe
 *
 * @param hookRequest
 * @param reply
 * @returns boolean
 */
export function validateHookRequest(hookRequest: CDSHooks.HookRequest<Record<string, any>>, service: Service): Error | undefined {
  // @ts-ignore
  const context = validateContext(hookRequest.context, hookRequest.hook)

  if (context.errors) {
    const error = schemaErrorFormatter(context.errors, 'body.context')
    // @ts-ignore
    error.validation = context.errors;
    // @ts-ignore
    error.validationContext = 'body.context'

    return error
  }
}

function schemaErrorFormatter (errors: ErrorObject[], dataVar: string) {
  let text = ''
  const separator = ', '

  for (var i = 0; i !== errors.length; ++i) {
    const e = errors[i]
    // @ts-ignore
    text += dataVar + (e.dataPath || '') + ' ' + e.message + separator
  }
  return new Error(text.slice(0, -separator.length))
}

function validatePrefetchContract(prefetch: Record<string, any> | undefined, service: Service): boolean {
	// Service expects prefetch and no prefetch was sent
	if (service.prefetch && !prefetch) {
		return false;
	}
	// Service expects prefetch and it's present
	else if (service.prefetch && prefetch) {
		return Object.keys(service.prefetch) == Object.keys(prefetch)
	}
	// Else the service doesn't have a prefetch and it doesn't matter what is sent
	else {
		return true;
	}
}

function validateContext(context: Record<string, any>, hook: Hooks) {
  const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allErrors: false
  })

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