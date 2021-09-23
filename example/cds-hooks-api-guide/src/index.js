import { CDSHooks } from "@sero.run/sero";
import Fastify from "fastify";

import compareTimeService from "./current-time/current-time.js";
import prefetchContext from "./prefetch-context/prefetch-context.js";
import suggestionsLinksFhir from "./suggestions-links-fhir/suggestions-links-fhir.js";

const config = {
  services: [compareTimeService, prefetchContext, suggestionsLinksFhir],
  cors: true,
};

const fastify = Fastify({
  logger: true,
});

fastify.register(CDSHooks, config);
fastify.listen(8080, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
