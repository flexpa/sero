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

export default interface SeroConfiguration {
	store?: Storage,
	rest?: restConfig;
	http?: FastifyServerOptions;
	cdsHooks?: cdsHooksConfig;
}