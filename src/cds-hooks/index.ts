/**
 * @module cds-hooks
 */

import { FastifyInstance } from "fastify";
import { Config } from "..";
import routes from "./routes";
import Service from "./service";

export function getService(services: Service[], id: string): Service | undefined {
  return services.find((service) => service.id == id)
}

export type Hooks = "patient-view" | "order-sign" | "order-select" | "order-review" | "medication-prescribe" | "encounter-start" | "encounter-discharge" | "appointment-book"

export { default as Service } from "./service";
export { default as Card } from "./card";
export { default as Suggestion } from "./suggestion";

export class NoDecisionResponse extends Error { }
