/**
 * @module smart-launch
 * 
 * A SMART App Launch server with fastify
 * 
 * @implements http://www.hl7.org/fhir/smart-app-launch/
 * @implements http://build.fhir.org/ig/HL7/bulk-data/authorization.html
 * 
 */
import { FastifyInstance } from 'fastify'
import Config from '../config';
import { jwtVerify } from 'jose/jwt/verify'

 
export default (config: Config, http: FastifyInstance): void => {
  if (!config.http?.hostname) throw new Error("config.http.hostname must be provided")

  const launcherConfig: SMART.Launcher = {
    token_endpoint: `${config.http?.hostname}/smart/token`,
    token_endpoint_auth_methods_supported: ["private_key_jwt"],
    token_endpoint_auth_signing_alg_values_supported: ["RS256", "ES384"],
    scopes_supported: ["system/*.read"],
    authorization_endpoint: `${config.http?.hostname}/smart/auth`,
    introspection_endpoint: `${config.http?.hostname}/smart/introrspect`,
    revocation_endpoint: `${config.http?.hostname}/smart/revoke`,
    response_types_supported: ["code"],
    code_challenge_methods_supported: ["S256"],
    capabilities: [
      "permission-v1"
    ]
  }

  http.get("/.well-known/smart-configuration", function (request, reply) {
    reply.send(launcherConfig)
  })

  http.post("/smart/introspect", function (request, reply) {
    
  })

  http.post("/smart/token", function (request, reply) {
    
  })

  http.get("/smart/auth", function (request, reply) {
    
  })

  http.post("/smart/revoke", function (request, reply) {

  })
}