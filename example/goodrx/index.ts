import { start } from "../../src/http";
import { Config, Http, CDSHooks } from "../../src"

import goodRxComparePriceService from "./good-rx-compare-price";

const config: Config = {
  cdsHooks: {
    services: [
      goodRxComparePriceService
    ],
    cors: true
  }
}

export const http = Http(config);

CDSHooks(config, http);
start(http);