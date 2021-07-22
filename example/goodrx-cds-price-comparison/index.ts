import { start } from "@sero.run/sero/http"; // @todo skip dist here??
import { Config, Http, CDSHooks } from "@sero.run/sero"

import goodRxComparePriceService from "./good-rx-compare-price";

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