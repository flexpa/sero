import { CDSService, CDSCard } from "@sero.run/sero";
import {
  processAddresses,
  processPatientNames,
  processTelecom,
  processEncounters,
  newAppointment,
} from "./util.js";

const options = {
  id: "prefetch-context",
  title: "Patient view with last encounter.",
  hook: "patient-view",
  description:
    "A patient-view hook with patient and encounter prefetch template values. Presents patient info and last encounter information",
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
  const encounters = processEncounters(data.encounter);
  const newApp = newAppointment(data.encounter, 100);
  return {
    cards: [
      // Name(s)
      new CDSCard({
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
      new CDSCard({
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Date of birth: ${data.patient.birthDate}`,
        indicator: "info",
      }),
      // Active
      new CDSCard({
        detail: data.patient.active ? "Yes" : "No",
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Active`,
        indicator: "info",
      }),
      // Address
      new CDSCard({
        detail: `${addresses[0].line}, ${addresses[0].city}, ${addresses[0].state} ${addresses[0].postalCode}`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Current Address`,
        indicator: "info",
      }),
      // Gender
      new CDSCard({
        detail: `${data.patient.gender}`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Gender`,
        indicator: "info",
      }),
      // Telecom (only pulls value of first element in array)
      new CDSCard({
        detail: `${telecom[0].value}`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Contact`,
        indicator: "info",
      }),
      // Information on the last encounter
      new CDSCard({
        detail: `Last visit was on ${
          encounters.pop().resource.period.start
        }. There are ${encounters.length} encounter${
          encounters.length ? "s" : ""
        } on record.`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Last visit`,
        indicator: "info",
      }),
      // Seeing the last encounter information
      new CDSCard({
        detail: `Make a new appointment? ${
          newApp[0] ? "Yes" : "No"
        }, last appointment was ${newApp[1]} day${newApp[1] ? "s" : ""} ago.`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Book new appointment`,
        indicator: "info",
      }),
    ],
  };
};

export default new CDSService(options, handler);
