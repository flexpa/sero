import { Http, CDSHooks, start } from "@sero.run/sero";

import davicniCrd from "./davinci-crd-service/davicni-crd.js";

const config = {
  cdsHooks: {
    services: [davicniCrd],
    cors: true,
  },
};

const http = Http(config);
CDSHooks(config, http);
start(http);
