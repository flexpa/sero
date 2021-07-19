import { Service, Card } from "../../src/cds-hooks";
import {
  processAddresses,
  processPatientNames,
  processTelecom,
  buildPatient
} from "./util";

/**
 * patient-view-kitchen-sink
 *
 * Workflow
 *
 * The user has just opened a patient's record; typically called only once at
 * the beginning of a user's interaction with a specific patient's record.
 *
 * In this example, a user has opened a patients record without an encounter
 * (the patient is not currently being looked at). Information about the
 * patient, including their most recent encounter information, are queried
 * from the service prefetch.
 *
 *  Field                      Prefetch?          Description
 *
 *  userId         Required    Yes      string    The id of the current user. Must be in the format [ResourceType]/[id]. For this hook, the user is expected to be of type Practitioner, PractitionerRole, Patient, or RelatedPerson. Patient or RelatedPerson are appropriate when a patient or their proxy are viewing the record. For example, Practitioner/abc or Patient/123.
 *  patientId      Required    Yes      string    The FHIR Patient.id of the current patient in context
 *  encounterId    Optional    Yes      string    The FHIR Encounter.id of the current encounter in context
 *
 *  specificationVersion    1.0
 *  hookVersion             1.0
 *  hookMaturity            5 - Mature
 */

export default new Service(
  {
    id: "9",
    title: "Patient view with last encounter",
    hook: "patient-view",
    description:
      "A patient-view hook with patient and encounter prefetch template values. presents patient info and last encounter information",
    prefetch: {
      patient: "Patient/{{context.patientId}}",
      encounter: "Encounter?subject={{context.patientId}}&_sort=date",
    },
  },
  (
    request: CDSHooks.HookRequest<{
      patient: fhir4.Patient;
      encounter: fhir4.Bundle;
    }>
  ) => {
    const data = request.prefetch;
    const patientNames = processPatientNames(data.patient);
    const addresses = processAddresses(data.patient);
    const telecom = processTelecom(data.patient);
    // const contacts = processContacts(data.patient);
    // @todo no explicit any here, as fhir4.BundleEntry does not outline start and end period for an encounter
    const encounters: Array<any> = [];
    const cards = buildPatient(data.patient);
    data.encounter.entry?.forEach((entry) => {
      encounters.push(entry);
    });
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
      ],
    };
  }
);