/**
 * @module @sero/cds-hooks
 */

import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { Config } from "..";
import routes from "./routes";

export default (config: Config, http: FastifyInstance): void => {
  routes(http, config.cdsHooks);
}

export function getService(services: Service[], id: string): Service | undefined {
	return services.find((service) => service.id == id)
}

/**
 * ServiceHandler is a function signature for the function invoked on the service
 * to resolve a HookRequest
 *
 * @todo Is it possible to structure the generic here on something other than `any`?
 */
type ServiceHandler = {
  (request: CDSHooks.HookRequest<any>): CDSHooks.HookResponse;
};

export type Hooks = "patient-view" | "order-sign" | "order-select" | "order-review" | "medication-prescribe" | "encounter-start" | "encounter-discharge" | "appointment-book"

/**
 * Service implements the idea of the same name in the CDS Hooks specification
 * 
 * @beta
 * @todo Support warning message if prefetch query restrictions are broken
 * https://cds-hooks.org/specification/current/#prefetch-query-restrictions
 */
export class Service implements CDSHooks.Service {
  /**
   * The {id} portion of the URL to this service which is available at `{baseUrl}/cds-services/{id}`
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
   * An object containing key/value pairs of FHIR queries that this service is requesting that the CDS Client prefetch and provide on each service call. The key is a string that describes the type of data being requested and the value is a string representing the FHIR query.
   */
  public prefetch?: CDSHooks.PrefetchTemplate;
  /**
   * A function to execute on HookRequest invocation events
   */
  public fn: ServiceHandler;

  /**
   * Pass any options along with a function that will execute on HookRequest invocation events
   * 
   * @param options 
   * @param fn 
   */
  constructor(
    options: Partial<CDSHooks.Service> & { hook: Hooks; description: string },
    fn: ServiceHandler
  ) {
    this.hook = options.hook;
    this.description = options.description;
    this.prefetch = options.prefetch;
    this.title = options.title;
    this.id = options.id || randomUUID();
    this.fn = fn;
  }
}

/**
 * For successful responses, CDS Services respond with a 200 HTTP response with an object containing a cards array.
 *
 * Each card contains decision support from the CDS Service. Generally speaking, cards are intended for display to an end user. The data format of a card defines a very minimal set of required attributes with several more optional attributes to suit a variety of use cases. For instance, narrative informational decision support, actionable suggestions to modify data, and links to SMART apps.
 *
 * @example Here's an example of creating a Card:
 * ```typescript
 * new Card({
 *   detail: "This is a card",
 *   source: {
 *     label: "CDS Services Inc",
 *   },
 *   summary: "A summary of the findings",
 *   indicator: "info"
 * })
 * ````
 * @alpha
 * @todo Support warning message if prefetch query restrictions are broken
 * https://cds-hooks.org/specification/current/#prefetch-query-restrictions
 */
export class Card implements CDSHooks.Card {
  /**
   * Unique identifier of the card. MAY be used for auditing and logging cards and SHALL be included in any subsequent calls to the CDS service's feedback endpoint.
   */
  uuid: string;
  /**
   * One-sentence, <140-character summary message for display to the user inside of this card.
   */
  summary: string;
  /**
   * Optional detailed information to display; if provided MUST be represented in (GitHub Flavored) Markdown. (For non-urgent cards, the CDS Client MAY hide these details until the user clicks a link like "view more details...").
   */
  detail?: string;
  /**
   * Urgency/importance of what this card conveys. Allowed values, in order of increasing urgency, are: info, warning, critical. The CDS Client MAY use this field to help make UI display decisions such as sort order or coloring.
   */
  indicator: 'info' | 'warning' | 'critical';
  /**
   * Grouping structure for the Source of the information displayed on this card. The source should be the primary source of guidance for the decision support the card represents.
   */
  source: CDSHooks.Source;
  /**
   * Allows a service to suggest a set of changes in the context of the current activity (e.g. changing the dose of the medication currently being prescribed, for the `medication-prescribe` activity). If suggestions are present, `selectionBehavior` MUST also be provided.
   */
  suggestions?: CDSHooks.Suggestion[];
  /**
   * Describes the intended selection behavior of the suggestions in the card. Allowed values are: at-most-one, indicating that the user may choose none or at most one of the suggestions;any, indicating that the end user may choose any number of suggestions including none of them and all of them. CDS Clients that do not understand the value MUST treat the card as an error.
   */
  selectionBehavior?: 'at-most-one' | 'any';
  /**
   * Override reasons can be selected by the end user when overriding a card without taking the suggested recommendations. The CDS service MAY return a list of override reasons to the CDS client. The CDS client SHOULD present these reasons to the clinician when they dismiss a card. A CDS client MAY augment the override reasons presented to the user with its own reasons.
   */
  overrideReasons?: CDSHooks.OverrideReason[];
  /**
   * Allows a service to suggest a link to an app that the user might want to run for additional information or to help guide a decision.
   */
  links?: CDSHooks.Link[];

  constructor(options: Partial<CDSHooks.Card> & { source: CDSHooks.Source; summary: string; indicator: 'info' } ) {
    this.uuid = options.uuid || randomUUID();
    this.detail = options.detail;
    this.suggestions = options.suggestions;
    this.selectionBehavior = options.selectionBehavior;
    this.overrideReasons = options.overrideReasons;
    this.links = options.links;
    this.source = options.source;
    this.summary = options.summary;
    this.indicator = options.indicator;
  }
}