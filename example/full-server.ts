import { Config, Http, CDSHooks, Rest } from "../src";

import appointmentBookExample from "./cds-hooks/appointment-book";
import encounterDischargeExample from "./cds-hooks/encounter-discharge";
import encounterStartExample from "./cds-hooks/encounter-start";
import medicationPrescribeExample from "./cds-hooks/medication-prescribe";
import orderReviewExample from "./cds-hooks/order-review";
import orderSelectExample from "./cds-hooks/order-select";
import orderSignExample from "./cds-hooks/order-sign";
import patientViewExample from "./cds-hooks/patient-view";
import betterPatientView from "./cds-hooks/better-patient-view";
import getCurrentTime from "./current-time/get-current-time";

const config: Config = {
  cdsHooks: {
    services: [
      appointmentBookExample,
      medicationPrescribeExample,
      encounterDischargeExample,
      encounterStartExample,
      orderReviewExample,
      orderSelectExample,
      orderSignExample,
      patientViewExample,
      betterPatientView,
      getCurrentTime
    ],
    cors: true,
  },
  http: {
    logger: {
      prettyPrint: true
    },
  }
}

export const http = Http(config);

CDSHooks(config, http);
Rest(config, http);
