import { Config, Http, CDSHooks, Rest } from "../src"
import { start } from "../src/http";

import cdsServiceExample from "./cds-hooks/medication-prescribe_echo"

const config: Config = {
  cdsHooks: {
    services: [ cdsServiceExample ],
    cors: true
  },
	rest: [
		"capabilityStatement",
		"batch",
		"instanceOperations",
		"typeOperations"
	]
}

const http = Http(config);

CDSHooks(config, http);
Rest(config, http);

start(http);