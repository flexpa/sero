import { CDSHooks } from "@sero.run/sero";
import Fastify from "fastify";

import patientView from "./patient-view/patient-view.js";

const config = {
  services: [patientView],
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
