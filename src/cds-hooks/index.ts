/**
 * @module cds-hooks
 */

import { FastifyInstance } from "fastify";
import { Config } from "..";
import routes from "./routes";
import Service from "./service";

export default (config: Config, http: FastifyInstance): void => {
  routes(http, config.cdsHooks);
}

export function getService(services: Service[], id: string): Service | undefined {
  return services.find((service) => service.id == id)
}

export type Hooks = "patient-view" | "order-sign" | "order-select" | "order-review" | "medication-prescribe" | "encounter-start" | "encounter-discharge" | "appointment-book"

export { default as Service } from "./service";
export { default as Card } from "./card";
export { default as Suggestion } from "./suggestion";

export class NoDecisionResponse extends Error { }

export interface SystemAction {
  /**
   * The type of action being performed. Allowed values are: create, update, delete.
   */
  type: 'create' | 'update' | 'delete'

  /**
   * Human-readable description of the suggested action MAY be presented to the
   * end-user.
   */
  description: string

  /**
   * A FHIR resource. When the type attribute is create, the resource attribute
   * SHALL contain a new FHIR resource to be created. For update, this holds
   * the updated resource in its entirety and not just the changed fields. Use
   * of this field to communicate a string of a FHIR id for delete suggestions
   * is DEPRECATED and resourceId SHOULD be used instead.
   */
  resource?: any

  /**
   * A relative reference to the relevant resource. SHOULD be provided when the
   * type attribute is delete.
   */
  resourceId?: string
}

// -- Request

export interface FhirAuthorization {
  /**
   * This is the OAuth 2.0 access token that provides access to the FHIR
   * server.
   */
  access_token: string

  token_type: 'Bearer'

  /**
   * The lifetime in seconds of the access token.
   */
  expires_in: number

  /**
   * The scopes the access token grants the CDS Service.
   */
  scope: string

  /**
   * The OAuth 2.0 client identifier of the CDS Service, as registered with the
   * CDS Client's authorization server.
   */
  subject: string
}