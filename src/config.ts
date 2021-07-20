import { FastifyServerOptions } from "fastify";
import { Service } from "./cds-hooks";
import { RestResourceCapability } from "./rest/capabilities";

interface cdsHooksConfig {
	services: Service[];
	cors: boolean;
}

interface restConfig {
	capabilityStatement: fhir4.CapabilityStatement;
	restResourceCapabilities: {
		[key: string]: RestResourceCapability;
	};
}

interface httpConfig extends FastifyServerOptions {
  hostname: string;
}

interface smartConfig {
  backendServices: boolean // should default true
  clients: SMART.App[]
}

export default interface SeroConfiguration {
	store?: Storage,
	rest?: restConfig;
  http?: httpConfig;
  cdsHooks?: cdsHooksConfig;
  smartLaunch?: smartConfig;
}