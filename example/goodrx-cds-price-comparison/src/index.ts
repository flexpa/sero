import { Http, CDSHooks, start } from "@sero.run/sero"
import goodRxComparePriceService from "./good-rx-compare-price.js";

const config = {
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

const http = Http(config);

CDSHooks(config, http);
start(http);