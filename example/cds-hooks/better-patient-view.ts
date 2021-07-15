import { Service, Card } from "../../src/cds-hooks";

/**
 * patient-view-kitchen-sink
 *
 * Workflow
 *
 * The user has just opened a patient's record; typically called only once at
 * the beginning of a user's interaction with a specific patient's record.
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
    title: "A better patient view service example",
    hook: "patient-view",
    description:
      "An example of a patient view hook with a summary with information received from the pre-fetch response",
    prefetch: {
      patient: "Patient/{{context.patientId}}",
    },
  },
  (
    request: CDSHooks.HookRequest<{
      patient: fhir4.Patient;
    }>
  ) => {
    const data = request.prefetch;
    // extract name(s)
    const patientNames: Array<fhir4.HumanName> = [];
    data.patient.name?.forEach((name) => {
      patientNames.push(name);
    });
    return {
      cards: [
        // Name(s)
        new Card({
          detail: `This patient has ${patientNames.length} name${
            patientNames.length === 0 ? "s" : ""
          } on record.`,
          source: {
            label: "Automate Medical, LLC",
            url: "https://www.automatemedical.com/",
          },
          summary: `Now seeing: ${patientNames[0].given} ${patientNames[0].family}.`,
          indicator: "info",
        }),
        // DOB
        new Card({
          source: {
            label: "Automate Medical, LLC",
            url: "https://www.automatemedical.com/",
          },
          summary: `Date of birth: ${data.patient.birthDate}`,
          indicator: "info",
        }),
      ],
    };
  }
);
