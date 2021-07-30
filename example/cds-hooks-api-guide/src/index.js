import { Http, CDSHooks, start } from "@sero.run/sero";

const config = {};

const http = Http(config);
CDSHooks(config, http);
start(http);
