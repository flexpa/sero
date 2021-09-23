/* eslint-disable @typescript-eslint/no-unused-vars */

import { CDSService, CDSCard, CDSHookRequest } from "../../src/cds-hooks";

/**
 * patient-view
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

export default new CDSService(
  {
    id: "8",
    title: "patient-view Hook Service Example",
    hook: "patient-view",
    description: "An example",
    prefetch: {
      patient: "Patient/{{context.patientId}}"
    }
  },
  (_request: CDSHookRequest<{ patient: fhir4.Patient }>) => {

    return {
      cards: [
        new CDSCard({
          detail: "This is a card",
          source: {
            label: "CDS Services Inc",
          },
          summary: "A summary of the findings",
          indicator: "info"
        })
      ]
    }
  }
)