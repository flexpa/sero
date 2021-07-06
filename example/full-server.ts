import { Config, Http, CDSHooks, Rest } from "../src"

import cdsServiceExample from "./cds-hooks/medication-prescribe"

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

export const http = Http(config);

CDSHooks(config, http);
Rest(config, http);