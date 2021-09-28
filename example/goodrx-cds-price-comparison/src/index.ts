import { CDSHooks } from "@sero.run/sero";
import Fastify from "fastify";
import goodRxComparePriceService from "./good-rx-compare-price.js";

const config = {
  services: [goodRxComparePriceService],
  cors: true,
  http: {
    logger: {
      prettyPrint: true,
    },
  },
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
