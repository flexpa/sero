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

type ServiceHandler = {
  (request: CDSHooks.HookRequest<CDSHooks.PrefetchTemplate>): CDSHooks.HookResponse;
};

export class Service implements CDSHooks.Service {
  public id: string;
  public title?: string;
  public description: string;
  public hook: string;
  public prefetch?: CDSHooks.PrefetchTemplate;
  public fn: ServiceHandler;

  // https://cds-hooks.org/specification/current/#prefetch-query-restrictions
  // Support warning message if prefretch query restrictions are broken (possible to do this or not...)
  constructor(
    options: CDSHooks.Service,
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

export class Card implements CDSHooks.Card {
  uuid: string;
  summary: string;
  detail?: string;
  indicator: ('info' | 'warning' | 'critical') = 'info';
  source: CDSHooks.Source;
  suggestions?: CDSHooks.Suggestion[];
  selectionBehavior?: 'at-most-one' | 'any';
  overrideReasons?: CDSHooks.OverrideReason[];
  links?: CDSHooks.Link[];

  constructor(options: CDSHooks.Card) {
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