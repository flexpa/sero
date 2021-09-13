import { Http, CDSHooks, start } from "@sero.run/sero";
import patientView from "./patient-view/patient-view.js";

const config = {
  cdsHooks: {
    services: [patientView],
    cors: true,
  },
};

const http = Http(config);
CDSHooks(config, http);
start(http);
