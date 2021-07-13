import { randomUUID } from "crypto";
import { Hooks } from ".";

/**
 * ServiceHandler is a function signature for the function invoked on the
 * service to resolve a HookRequest
 *
 * @todo Is it possible to structure the generic here on something other than
 * `any`?
 */
type ServiceHandler = {
  (request: CDSHooks.HookRequest<any>): Promise<CDSHooks.HookResponse> | CDSHooks.HookResponse;
};

/**
 * A **Service** that provides patient-specific recommendations and guidance
 * through RESTful APIs as described by the CDS Hooks spec.
 *
 * The primary APIs are Discovery, which allows a CDS Developer to publish the
 * types of CDS Services it provides, and the Service endpoint that CDS Clients
 * use to request and invoke decision support services.
 *
 * **Service** automatically creates an HTTP API conformant with the CDS Hooks
 * spec for you with just a few lines of code. Internally, **Service** uses
 * {@link http} and to deliver its HTTP API. **Service** can be used in
 * isolation or in combination with other modules composed on top of
 * {@link http} like {@link rest} and {@link smart}.
 *
 * When invoked in response to a HookRequest event by a CDS Client, Service will
 * first validate the request and then call the invocation function as defined
 * at construction. This function, {@link handler}, receives the prefetch
 * response in the HookRequest as defined by the Service up front. You can
 * perform any necessary work here necessary to satisfy the request. Calling out
 * to a tensorflow model, or passing parameters to an external API for example.
 *
 * @version https://cds-hooks.hl7.org/ballots/2020Sep/
 *
 * @todo Support warning message if prefetch query restrictions are broken
 * https://cds-hooks.org/specification/current/#prefetch-query-restrictions
 *
 * @example Here's an example:
 * ```typescript
 *  new Service(
 *    {
 *      title: "patient-view Hook Service Example",
 *      hook: "patient-view",
 *      description: "An example",
 *      prefetch: {
 *        patient: "Patient/{{context.patientId}}"
 *      }
 *    },
 *    (request: CDSHooks.HookRequest<{ patient: fhir4.Patient }>) => {
 *      const { patient } = request.prefetch;
 *      // Your response logic here
 *      return { cards: [] }
 *    }
 * )
 * ```
 */
export default class Service implements CDSHooks.Service {
  /**
   * The id portion of the URL to this service which is available at
   * `{baseUrl}/cds-services/{id}`
   */
  public id: string;
  /**
   * The human-friendly name of this service.
   */
  public title?: string;
  /**
   * The description of this service.
   */
  public description: string;
  /**
   * The hook this service should be invoked on.
   */
  public hook: Hooks;
  /**
   * An object containing key/value pairs of FHIR queries that this service is
   * requesting that the CDS Client prefetch and provide on each service call.
   * The key is a string that describes the type of data being requested and the
   * value is a string representing the FHIR query.
   */
  public prefetch?: CDSHooks.PrefetchTemplate;
  /**
   * A function to execute on HookRequest invocation events
   */
  public handler: ServiceHandler;

  /**
   * Pass any options along with a function that will execute on HookRequest
   * invocation events
   *
   * @param options -
   * @param fn -
   */
  constructor(
    options: Partial<CDSHooks.Service> & { hook: Hooks; description: string },
    handler: ServiceHandler
  ) {
    this.hook = options.hook;
    this.description = options.description;
    this.prefetch = options.prefetch;
    this.title = options.title;
    this.id = options.id || randomUUID();
    this.handler = handler;
  }
}