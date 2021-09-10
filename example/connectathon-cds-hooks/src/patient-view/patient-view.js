import { Service, Card } from "@sero.run/sero";
import { processPatientNames } from "./util.js";

const options = {
  id: "sero-patient-view",
  title: "Sero patient view",
  hook: "patient-view",
  description:
    "Patient view hook for the cds hooks track for the September 2021 HL7 connectathon",
  prefetch: {
    patient: "Patient/{{context.patientId}}",
  },
};

const handler = async (request) => {
  const data = request.prefetch;
  const patientNames = processPatientNames(data.patient);
  return {
    cards: [
      // Name(s)
      new Card({
        detail: `This patient has ${patientNames.length} name${
          patientNames.length > 1 ? "s" : ""
        } on record.`,
        source: {
          label: "Sero patient view service",
          url: "https://www.automatemedical.com/",
        },
        summary: `Now seeing: ${patientNames[0].given}.`,
        indicator: "info",
        links: [
          {
            label: "Launch CarePassport portal",
            url: "https://carepassport.net/FHIR/launch.html",
            type: "smart",
          },
        ],
      }),
      // Active
      new Card({
        detail: data.patient.active
          ? "Patient is active"
          : "Patient is inactive",
        source: {
          label: "Sero patient view service",
          url: "https://www.automatemedical.com/",
        },
        summary: `Active`,
        indicator: "info",
      }),
    ],
  };
};

export default new Service(options, handler);
