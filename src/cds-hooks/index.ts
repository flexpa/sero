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
 * @todo Support warning message if prefetch query restrictions are broken
 * https://cds-hooks.org/specification/current/#prefetch-query-restrictions
 */
export class Service implements CDSHooks.Service {
  public id: string;
  public title?: string;
  public description: string;
  public hook: Hooks;
  public prefetch?: CDSHooks.PrefetchTemplate;
  public fn: ServiceHandler;

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
 * Card implements the idea of the same name in the CDS Hooks specification
 *
 * @todo Support warning message if prefetch query restrictions are broken
 * https://cds-hooks.org/specification/current/#prefetch-query-restrictions
 */
export class Card implements CDSHooks.Card {
  uuid: string;
  summary: string;
  detail?: string;
  indicator: 'info' | 'warning' | 'critical';
  source: CDSHooks.Source;
  suggestions?: CDSHooks.Suggestion[];
  selectionBehavior?: 'at-most-one' | 'any';
  overrideReasons?: CDSHooks.OverrideReason[];
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