import { Http, CDSHooks, start } from "@sero.run/sero";

import compareTimeService from "./current-time/current-time.js";
import prefetchContext from "./prefetch-context/prefetch-context.js";

const config = {
  cdsHooks: {
    services: [compareTimeService, prefetchContext],
    cors: true,
  },
};

const http = Http(config);
CDSHooks(config, http);
start(http);
