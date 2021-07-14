import { start } from "../../src/http";
import { Config, Http, CDSHooks } from "../../src"

import goodRxCompare from "./good-rx-compare-service";

const config: Config = {
  cdsHooks: {
    services: [
      goodRxCompare
    ],
    cors: true
  }
}

export const http = Http(config);

CDSHooks(config, http);
start(http);