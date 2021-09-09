import { Service, Card } from "@sero.run/sero";
import { processAddresses, processPatientNames, processTelecom } from "./util.js";

const options = {
  id: "sero-patient-view",
  title: "Sero patient view",
  hook: "patient-view",
  description:
    "Patient view hook for the cds hooks track for the September 2021 HL7 connectathon",
  prefetch: {
    patient: "Patient/{{context.patientId}}",
    encounter: "Encounter?subject={{context.patientId}}&_sort=date",
  },
};

const handler = async (request) => {
  const data = request.prefetch;
  const patientNames = processPatientNames(data.patient);
  const addresses = processAddresses(data.patient);
  const telecom = processTelecom(data.patient);
  return {
    cards: [
      // Name(s)
      new Card({
        detail: `This patient has ${patientNames.length} name${
          patientNames.length ? "s" : ""
        } on record.`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Now seeing: ${patientNames[0].given} ${patientNames[0].family}.`,
        indicator: "info",
      }),
      // DOB
      new Card({
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Date of birth: ${data.patient.birthDate}`,
        indicator: "info",
      }),
      // Active
      new Card({
        detail: data.patient.active ? "Yes" : "No",
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Active`,
        indicator: "info",
      }),
      // Address
      new Card({
        detail: `${addresses[0].line}, ${addresses[0].city}, ${addresses[0].state} ${addresses[0].postalCode}`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Current Address`,
        indicator: "info",
      }),
      // Gender
      new Card({
        detail: `${data.patient.gender}`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Gender`,
        indicator: "info",
      }),
      // Telecom (only pulls value of first element in array)
      new Card({
        detail: `${telecom[0].value}`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Contact`,
        indicator: "info",
      }),
    ],
  };
};

export default new Service(options, handler);
