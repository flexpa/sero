import { Http, CDSHooks, start } from "@sero.run/sero";
import orderSelect from "./order-select/order-select.js";
import patientView from "./patient-view/patient-view.js";

const config = {
  cdsHooks: {
    services: [patientView, orderSelect],
    cors: true,
  },
};

const http = Http(config);
CDSHooks(config, http);
start(http);
