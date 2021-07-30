import { Http, CDSHooks, start } from "@sero.run/sero";

import compareTimeService from "./current-time/current-time.js";

const config = {
  cdsHooks: {
    services: [compareTimeService],
    cors: true,
  },
};

const http = Http(config);
CDSHooks(config, http);
start(http);
