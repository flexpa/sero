import { Service, Card } from "../../src/cds-hooks";

export default new Service(
	{
		title: "Static CDS Service Example",
		hook: "patient-view",
		description: "An example of a CDS Service that returns a static set of cards",
		prefetch: {
			patient: "Patient/{{context.patientId}}"
		}
	},
	(request: CDSHooks.HookRequest<{ patient: fhir4.Patient }>) => {
		const { patient } = request.prefetch;

		return {
			cards: [
				new Card({
					detail: "This is a card with an warning indicator",
					source: {
						label: "Warning service",
					},
					summary: "Warning",
					indicator: "info"
				})
			]
		}
	}
)