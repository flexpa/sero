import { start } from "../../src/http";
import { Config, Http, CDSHooks } from "../../src";

import compareTimeService from "./get-current-time";

const config: Config = {
  cdsHooks: {
    services: [compareTimeService],
    cors: true,
  },
  http: {
    logger: {
      prettyPrint: true,
    },
  },
};

export const http = Http(config);

CDSHooks(config, http);
start(http);
