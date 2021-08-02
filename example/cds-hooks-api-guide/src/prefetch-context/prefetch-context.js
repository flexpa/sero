import { Service, Card } from "@sero.run/sero";
import {
  processAddresses,
  processPatientNames,
  processTelecom,
  processEncounters,
  newAppointment,
} from "./util.js";

export default new Service(
  {
    id: "prefetch-context",
    title: "Patient view with last encounter.",
    hook: "patient-view",
    description:
      "A patient-view hook with patient and encounter prefetch template values. Presents patient info and last encounter information",
    prefetch: {
      patient: "Patient/{{context.patientId}}",
      encounter: "Encounter?subject={{context.patientId}}&_sort=date",
    },
  },
  (request) => {
    const data = request.prefetch;
    const patientNames = processPatientNames(data.patient);
    const addresses = processAddresses(data.patient);
    const telecom = processTelecom(data.patient);
    const encounters = processEncounters(data.encounter);
    const newApp = newAppointment(data.encounter, 100);
    return {
      cards: [
        // Name(s)
        new Card({
          detail: `This patient has ${patientNames.length} name${
            patientNames.length <= 1 ? "" : "s"
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
          detail: `${data.patient.active === true ? "Yes" : "No"}`,
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
        // Information on the last encounter
        new Card({
          detail: `Last visit was on ${
            encounters.pop().resource.period.start
          }. There are ${encounters.length} encounter${
            encounters.length <= 1 ? "" : "s"
          } on record.`,
          source: {
            label: "Automate Medical, Inc.",
            url: "https://www.automatemedical.com/",
          },
          summary: `Last visit`,
          indicator: "info",
        }),
        // Seeing the last encounter information
        new Card({
          detail: `Make a new appointment? ${
            newApp[0] === true ? "Yes" : "No"
          }, last appointment was ${newApp[1]} day${
            newApp[1] > 1 ? "s" : ""
          } ago.`,
          source: {
            label: "Automate Medical, Inc.",
            url: "https://www.automatemedical.com/",
          },
          summary: `Book new appointment`,
          indicator: "info",
        }),
      ],
    };
  }
);
