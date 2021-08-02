import { Http, CDSHooks, start } from "@sero.run/sero";

import compareTimeService from "./current-time/current-time.js";
import prefetchContext from "./prefetch-context/prefetch-context.js";
import suggestionsLinksFhir from "./suggestions-links-fhir/suggestions-links-fhir.js";

const config = {
  cdsHooks: {
    services: [compareTimeService, prefetchContext, suggestionsLinksFhir],
    cors: true,
  },
};

const http = Http(config);
CDSHooks(config, http);
start(http);
