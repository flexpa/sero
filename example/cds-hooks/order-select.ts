import { Service, Card } from "../../src/cds-hooks";

/**
 * order-select
 *
 * Workflow
 *
 * The order-select hook fires when a clinician selects one or more orders to
 * place for a patient, (including orders for medications, procedures, labs and
 * other orders). If supported by the CDS Client, this hook may also be invoked
 * each time the clinician selects a detail regarding the order. This hook is
 * among the first workflow events for an order entering a draft status. The
 * context of this hook may include defaulted order details as it first occurs
 * immediately upon the clinician selecting the order from the order catalogue
 * of the CPOE, or upon her manual selection of order details (e.g. dose,
 * quantity, route, etc). CDS services should expect some of the order
 * information to not yet be specified. Additionally, the context may include
 * previously selected orders that are not yet signed from the same ordering
 * session. The order-select hook occurs after the clinician selects the order
 * and before signing.
 *
 * This hook is intended to replace (deprecate) the medication-prescribe hook.
 *
 * Decision support should focus on the 'selected' orders - those that are newly
 * selected or actively being authored. The non-selected orders are included in
 * the context to provide context and to allow decision support to take into
 * account other pending actions that might not yet be stored in the system (and
 * therefore not queryable). The context of this hook distinguishes between the
 * list of unsigned orders from the clinician's ordering session, and the one or
 * more orders just added to this list. The selections field contains a list of
 * ids of these newly selected orders; the draftOrders Bundle contains an entry
 * for all unsigned orders from this session, including newly selected orders.
 *
 *  Field                      Prefetch?          Description
 *
 *  userId         Required    Yes      string    The id of the current user. For this hook, the user is expected to be of type Practitioner. For example, Practitioner/123
 *  patientId      Required    Yes      string    The FHIR Patient.id of the current patient in context
 *  encounterId    Optional    Yes      string    The FHIR Encounter.id of the current encounter in context
 *  selections     Required    No       array     The FHIR id of the newly selected order(s). The selections field references FHIR resources in the draftOrders Bundle. For example, MedicationRequest/103.
 *  draftOrders    Required    No       object    object  DSTU2 - FHIR Bundle of MedicationOrder, DiagnosticOrder, DeviceUseRequest, ReferralRequest, ProcedureRequest, NutritionOrder, VisionPrescription with draft status STU3 - FHIR Bundle of MedicationRequest, ReferralRequest, ProcedureRequest, NutritionOrder, VisionPrescription with draft status R4 - FHIR Bundle of DeviceRequest, MedicationRequest, NutritionOrder, ServiceRequest, VisionPrescription with draft status
 *
 *  specificationVersion    1.0
 *  hookVersion             1.0
 *  hookMaturity            1 - Submitted
 */
export default new Service(
  {
    id: "6",
    title: "order-select Hook Service Example",
    hook: "order-select",
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