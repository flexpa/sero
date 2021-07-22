/* eslint-disable @typescript-eslint/no-unused-vars */

import { Service, Card } from "../../dist/cds-hooks";
import { HookRequest } from "../../dist/types";

/**
 * appointment-book
 *
 * Workflow
 *
 * This hook is invoked when the user is scheduling one or more future
 * encounters/visits for the patient. For example, the appointment-book hook may
 * be triggered for an appointment with the appointment creator, a clinician
 * within the same organization as the appointment creator or even for an
 * appointment outside the creator's organization. It may be invoked at the
 * start and end of the booking process and/or any time between those two
 * points. This hook enables CDS Services to intervene in the decision of when
 * future appointments should be scheduled, where they should be scheduled, what
 * services should be booked, to identify actions that need to occur prior to
 * scheduled appointments, etc.
 *
 *  Field                     Prefetch?         Description
 *
 *  userId        Required    Yes      string    The id of the current user. Must be in the format [ResourceType]/[id]. For this hook, the user is expected to be of type Practitioner, PractitionerRole, Patient, or RelatedPerson. Patient or RelatedPerson are appropriate when a patient or their proxy are viewing the record. For example, Practitioner/abc or Patient/123.
 *  patientId     Required    Yes      string    The FHIR Patient.id of the current patient in context
 *  encounterId   Optional    Yes      string    The FHIR Encounter.id of the current encounter in context
 *  appointments  Required    No       object    DSTU2/STU3/R4 - FHIR Bundle of Appointments in 'proposed' state
 *
 *  specificationVersion    1.0
 *  hookVersion             1.0
 *  hookMaturity            1 - Submitted
 */
export default new Service(
  {
    id: "1",
    title: "appointment-book Hook Service Example",
    hook: "appointment-book",
    description: "An example",
    prefetch: {
      patient: "Patient/{{context.patientId}}"
    }
  },
  (request: HookRequest<{ patient: fhir4.Patient }>) => {
    const { patient } = request.prefetch;

    return {
      cards: [
        new Card({
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