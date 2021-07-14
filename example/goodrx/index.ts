import { start } from "../../src/http";
import { Config, Http, CDSHooks } from "../../src"

<<<<<<< HEAD
import goodRxComparePriceService from "./good-rx-compare-price";
=======
import goodRxCompare from "./good-rx-compare-price-service";
>>>>>>> ca99d70 (Completes the GoodRx example)

const config: Config = {
  cdsHooks: {
    services: [
      goodRxComparePriceService
    ],
    cors: true
  },
  http: {
    logger: {
      prettyPrint: true
    }
  }
}

export const http = Http(config);

CDSHooks(config, http);
start(http);