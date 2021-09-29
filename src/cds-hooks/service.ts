import { randomUUID } from "crypto";
import { Hooks, SystemAction, FhirAuthorization } from "./util";
import CDSCard from "./card";

/**
 * ServiceHandler is a function signature for the function invoked on the
 * service to resolve a CDSHookRequest
 *
 * @todo Is it possible to structure the generic here on something other than
 * `any`?
 */
type ServiceHandler = {
  (request: CDSHookRequest<any>): Promise<CDSHookResponse> | CDSHookResponse;
};

/**
 * A **CDSService** that provides patient-specific recommendations and guidance
 * through RESTful APIs as described by the CDS Hooks spec.
 *
 * The primary APIs are Discovery, which allows a CDS Developer to publish the
 * types of CDS Services it provides, and the Service endpoint that CDS Clients
 * use to request and invoke decision support services.
 *
 * **CDSService** automatically creates an HTTP API conformant with the CDS Hooks
 * spec for you with just a few lines of code. Internally, **CDSService** uses
 * {@link http} and to deliver its HTTP API. **CDSService** can be used in
 * isolation or in combination with other modules composed on top of
 * {@link http} like {@link rest} and {@link smart}.
 *
 * When invoked in response to a CDSHookRequest event by a CDS Client, Service will
 * first validate the request and then call the invocation function as defined
 * at construction. This function, {@link handler}, receives the prefetch
 * response in the CDSHookRequest as defined by the Service up front. You can
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
 *  new CDSService(
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
export default class CDSService implements CDSService {
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
  public prefetch?: PrefetchTemplate;
  /**
   * A function to execute on CDSHookRequest invocation events
   */
  public handler: ServiceHandler;
  /**
   * An object containing key/value pairs of FHIR extensions. The key is the name
   * of the extension and the value is the extended data made available to the CDS
   * service. Extensions are loosely defined, as incorporating all valid
   * requirements would make this specification very cumbersome and difficult to
   * implement. Thus, all the additional information a service needs will be implemented
   * as an extension. 
   */
  public extension?: Extension;

  /**
   * Pass any options along with a function that will execute on CDSHookRequest
   * invocation events
   *
   * @param options -
   * @param fn -
   */
  constructor(
    options: Partial<CDSService> & { hook: Hooks; description: string },
    handler: ServiceHandler
  ) {
    this.hook = options.hook;
    this.description = options.description;
    this.prefetch = options.prefetch;
    this.extension = options.extension;
    this.title = options.title;
    this.id = options.id || randomUUID();
    this.handler = handler;
  }
}

export interface CDSHookResponse {
  /**
   * An array of Cards. Cards can provide a combination of information (for
   * reading), suggested actions (to be applied if a user selects them), and
   * links (to launch an app if the user selects them). The CDS Client decides
   * how to display cards, but this specification recommends displaying
   * suggestions using buttons, and links using underlined text.
   */
  cards?: CDSCard[];

  /**
   * An array of actions that the CDS Service proposes to auto-apply. Each
   * action follows the schema of a card-based suggestion.action. The CDS
   * Client decides whether to auto-apply actions.
   */
  systemActions?: SystemAction[];
}

/**
 * A prefetch template is a FHIR read or search request that describes relevant
 * data needed by the CDS Service. See:
 * https://cds-hooks.org/specification/current/#prefetch-template
 */
interface PrefetchTemplate {
  [key: string]: string;
}

/**
 * An extension is an additional information exchange specification based on
 * common requirements across healthcare. FHIR expects that additional requirements
 * are implemented as extensions.
 * See: https://cds-hooks.org/specification/current/#extensions
 * See: https://www.hl7.org/fhir/extensibility.html
 */
interface Extension {
  [key: string]: any;
}

interface CDSHookRequestWithFhir<T> extends CDSHookRequestBasic<T> {
  /**
   * The base URL of the CDS Client's FHIR server. If fhirAuthorization is
   * provided, this field is REQUIRED. The scheme should be https
   */
  fhirServer: string;

  /**
   * A structure holding an OAuth 2.0 bearer access token granting the CDS
   * Service access to FHIR resources, along with supplemental information
   * relating to the token.
   */
  fhirAuthorization: FhirAuthorization;
}

interface CDSHookRequestBasic<T> {
  /**
   * The hook that triggered this CDS Service call. See:
   * https://cds-hooks.org/specification/current/#hooks
   */
  hook: string;

  /**
   * A universally unique identifier (UUID) for this particular hook call.
   */
  hookInstance: string;

  /**
   * Hook-specific contextual data that the CDS service will need. For example,
   * with the patient-view hook this will include the FHIR identifier of the
   * Patient being viewed. For details, see the Hooks specification page.
   */
  context: any;

  /**
   * The FHIR data that was prefetched by the CDS Client
   */
  prefetch: T;
}

export type CDSHookRequest<T> = CDSHookRequestBasic<T> | CDSHookRequestWithFhir<T>;
