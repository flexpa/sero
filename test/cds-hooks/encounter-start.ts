/* eslint-disable @typescript-eslint/no-unused-vars */

import { CDSService, CDSCard, CDSHookRequest } from "../../src/cds-hooks";

/**
 * encounter-start
 *
 * Workflow
 *
 * This hook is invoked when the user is initiating a new encounter. In an
 * inpatient setting, this would be the time of admission. In an
 * outpatient/community environment, this would be the time of patient-check-in
 * for a face-to-face or equivalent for a virtual/telephone encounter. The
 * Encounter should either be in one of the following states: planned | arrived
 * | triaged | in-progress. Note that there can be multiple 'starts' for the
 * same encounter as each user becomes engaged. For example, when a scheduled
 * encounter is presented at the beginning of the day for planning purposes,
 * when the patient arrives, when the patient first encounters a clinician, etc.
 * Hooks may present different information depending on user role and
 * Encounter.status.
 *
 * Note: This is distinct from the patient-view hook which occurs any time the
 * patient's record is looked at - which might be done outside the context of
 * any encounter and will often occur during workflows that are not linked to
 * the initiation of an encounter.
 *
 * The intention is that the cards from any invoked CDS Services are available
 * at the time when decisions are being made about what actions are going to
 * occur during this encounter. For example, identifying that the patient is due
 * for certain diagnostic tests or interventions, identifying additional
 * information that should be collected to comply with protocols associated with
 * clinical studies the patient is enrolled in, identifying any documentation or
 * other requirements associated with patient insurance, etc.
 *
 *  Field                      Prefetch?          Description
 *
 *  userId         Required    Yes      string    The id of the current user. For this hook, the user is expected to be of type Practitioner or PractitionerRole. For example, PractitionerRole/123
 *  patientId      Required    Yes      string    The FHIR Patient.id of the current patient in context
 *  encounterId    Required    Yes      string    The FHIR Encounter.id of the current encounter in context
 *
 *  specificationVersion    1.0
 *  hookVersion             1.0
 *  hookMaturity            1 - Submitted
 */
export default new CDSService(
  {
    id: "3",
    title: "encounter-start Hook Service Example",
    hook: "encounter-start",
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