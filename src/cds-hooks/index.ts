/**
 * @module cds-hooks
 */

import { FastifyInstance } from "fastify";
import { Config } from "..";
import routes from "./routes";

export function mount(config: Config, http: FastifyInstance): void {
  routes(http, config.cdsHooks);
}

export { default as Service, HookRequest, HookResponse } from "./service";
export { default as Card } from "./card";
export { default as Suggestion } from "./suggestion";
export { NoDecisionResponse } from "./util";