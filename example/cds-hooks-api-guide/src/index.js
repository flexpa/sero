import { CDSHooks } from "@sero.run/sero";
import Http from "fastify";

import compareTimeService from "./current-time/current-time.js";
import prefetchContext from "./prefetch-context/prefetch-context.js";
import suggestionsLinksFhir from "./suggestions-links-fhir/suggestions-links-fhir.js";

const config = {
  services: [compareTimeService, prefetchContext, suggestionsLinksFhir],
  cors: true,
};

const http = Http();
http.register(CDSHooks, config);
