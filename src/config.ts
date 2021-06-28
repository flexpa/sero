import { FastifyServerOptions } from "fastify";
import { Service } from "./cds-hooks";
import Resource from "./resources";

type RestModule =
	"batch" |
	"instanceOperations" |
	"typeOperations" |
	"capabilityStatement";

interface cdsHooksConfiguration {
	services: Service[];
	cors: boolean;
}

export default interface SerotinyConfiguration {
	store?: Storage,
	rest?: RestModule[];
	fastifyOpts?: FastifyServerOptions;
	cdsHooks?: cdsHooksConfiguration;
}