import { Config, Http, CDSHooks } from "../src"
import { start } from "../src/http";

import cdsServiceExample from "./cds-hooks/medication-prescribe_echo"

const config: Config = {
  cdsHooks: {
    services: [ cdsServiceExample ],
    cors: true
  }
}

const http = Http(config);

CDSHooks(config, http);

start(http);