/* eslint-disable @typescript-eslint/no-unused-vars */

import { Service, Card } from "../../src/cds-hooks";

/**
 * encounter-discharge
 *
 * Workflow
 *
 * This hook is invoked when the user is performing the discharge process for an
 * encounter where the notion of 'discharge' is relevant - typically an
 * inpatient encounter. It may be invoked at the start and end of the discharge
 * process or any time between those two points. It allows hook services to
 * intervene in the decision of whether discharge is appropriate, to verify
 * discharge medications, to check for continuity of care planning, to ensure
 * necessary documentation is present for discharge processing, etc.
 *
 *  Field											Prefetch?					Description
 *
 *  userId				Required		Yes			string		The id of the current user. For this hook, the user is expected to be of type Practitioner or PractitionerRole. For example, PractitionerRole/123
 *  patientId			Required		Yes			string		The FHIR Patient.id of the current patient in context
 * 	encounterId		Required		Yes			string		The FHIR Encounter.id of the current encounter in context
 *
 * 	specificationVersion		1.0
 * 	hookVersion							1.0
 *	hookMaturity						1 - Submitted
 */
export default new Service(
  {
    id: "2",
    title: "encounter-discharge Hook Service Example",
    hook: "encounter-discharge",
    description: "An example",
    prefetch: {
      patient: "Patient/{{context.patientId}}"
    }
  },
  (request: CDSHooks.HookRequest<{ patient: fhir4.Patient }>) => {
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