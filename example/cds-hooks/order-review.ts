import { Service, Card } from "../../src/cds-hooks";

/**
 * order-review
 *
 * Workflow
 *
 * The user is in the process of prescribing one or more new medications.
 *
 * @deprecated This hook is deprecated in favor of the order-select and
 * order-sign hooks, with the goal of clarifying workflow trigger points and
 * supporting orders beyond medications. In this refactoring,
 * medication-prescribe and order-review hooks are being deprecated in favor of
 * newly created order-select and order-sign hooks. This notice is a placeholder
 * to this effect while CDS Hooks determines the appropriate process for
 * deprecating hooks.
 *
 *  Field                     Prefetch?          Description
 *
 *  userId        Required    Yes      string    The id of the current user. For this hook, the user is expected to be of type Practitioner. For example, Practitioner/123
 *  patientId     Required    Yes      string    The FHIR Patient.id of the current patient in context
 *  encounterId   Optional    Yes      string    The FHIR Encounter.id of the current encounter in context
 *  orders        Required    No       object    DSTU2 - FHIR Bundle of MedicationOrder, DiagnosticOrder, DeviceUseRequest, ReferralRequest, ProcedureRequest, NutritionOrder, VisionPrescription with draft status. STU3 - FHIR Bundle of MedicationRequest, ReferralRequest, ProcedureRequest, NutritionOrder, VisionPrescription with draft status
 *
 *  specificationVersion    1.0
 *  hookVersion             1.0
 *  hookMaturity            3 - Tested
 */
export default new Service(
  {
    id: "5",
    title: "order-review Hook Service Example",
    hook: "order-review",
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