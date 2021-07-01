import { Service } from "./index";

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
export function validateHookRequest(hookRequest: CDSHooks.HookRequest<Record<string, any>>, service: Service): boolean {
	return validatePrefetchContract(hookRequest.prefetch, service)
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