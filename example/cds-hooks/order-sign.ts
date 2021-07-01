import { Service, Card } from "../../src/cds-hooks";

/**
 * order-sign
 *
 * Workflow
 *
 * The order-sign hook fires when a clinician is ready to sign one or more
 * orders for a patient, (including orders for medications, procedures, labs and
 * other orders). This hook is among the last workflow events before an order is
 * promoted out of a draft status. The context contains all order details, such
 * as dose, quantity, route, etc, although the order has not yet been signed and
 * therefore still exists in a draft status. Use this hook when your service
 * requires all order details, and the clinician will accept recommended
 * changes.
 *
 * This hook is intended to replace (deprecate) the medication-prescribe and
 * order-review hooks.
 *
 *  Field											Prefetch?					Description
 *
 *  userId				Required		Yes			string		The id of the current user. For this hook, the user is expected to be of type Practitioner. For example, Practitioner/123
 *  patientId			Required		Yes			string		The FHIR Patient.id of the current patient in context
 * 	encounterId		Optional		Yes			string		The FHIR Encounter.id of the current encounter in context
 *  draftOrders		Required		No			object		DSTU2 - FHIR Bundle of MedicationOrder, DiagnosticOrder, DeviceUseRequest, ReferralRequest, ProcedureRequest, NutritionOrder, VisionPrescription with draft status. STU3 - FHIR Bundle of MedicationRequest, ReferralRequest, ProcedureRequest, NutritionOrder, VisionPrescription with draft status. R4 - FHIR Bundle of DeviceRequest, MedicationRequest, NutritionOrder, ServiceRequest, VisionPrescription with draft status
 *
 *  specificationVersion		1.0
 * 	hookVersion							1.0
 *	hookMaturity						1 - Submitted
 */
 export default new Service(
	{
		id: "7",
		title: "order-sign Hook Service Example",
		hook: "order-sign",
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