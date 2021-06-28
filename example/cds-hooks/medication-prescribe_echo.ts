import { Service, Card } from "../../src/cds-hooks";

interface PatientPrefetch {
	patient: fhir4.Patient;
}

export default new Service(
	{
		id: "medication-prescribe-request-01",
		title: "medication-prescribe hook echo",
		hook: "medication-prescribe",
		description: "An example of a CDS Service that returns echos on the medication-prescribe hook",
		prefetch: {
			patient: "Patient/{{context.patientId}}"
		}
	},
	(request: CDSHooks.HookRequest<PatientPrefetch | any>) => {
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