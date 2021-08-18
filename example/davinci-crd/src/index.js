import { Http, CDSHooks, start } from "@sero.run/sero";

const config = {
  cdsHooks: {
    services: [],
    cors: true,
  },
};

const http = Http(config);
CDSHooks(config, http);
start(http);
