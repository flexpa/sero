/**
 * @module rest
 */
import { FastifyPluginCallback } from 'fastify'
import { RestResourceCapability } from './capabilities.js';
import { capabilityStatement, interactions }from './routes/index.js';
import fastifyPlugin from "fastify-plugin";

export interface RestPluginConfig {
	capabilityStatement?: fhir4.CapabilityStatement;
	restResourceCapabilities: {
		[key: string]: RestResourceCapability;
	};
}

const oauthPlugin: FastifyPluginCallback<RestPluginConfig> = function (http, options: RestPluginConfig, next) {
  http.register(capabilityStatement, options);
  http.register(interactions, options);

  next();
}

export default fastifyPlugin(oauthPlugin, { name: "fhir-rest-api"})