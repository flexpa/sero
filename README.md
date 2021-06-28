# Serotiny

Serotiny is a modular TypeScript toolchain for FHIR (and friends).

Health data is spreading everywhere. FHIR is a big part of that. Serotiny is built for developers who need tools in the languages they know, with opinionated answers to solve common problems.

Features:
- A broken [FHIR](https://www.hl7.org/fhir/http.html) [REST](#rest)ful API implementation of base resources
- A non-existence [FHIR] GraphQL API implementation of base resources
- Actually good [CDS Hooks](#cds-hooks) Service support
- Modular design so that you can run 1 service or many
- In-memory persistence (please don't actually use this)
- Out of box typings support for FHIR R4 with generics

We're thinking about:
- SMART Apps/Launching
- Access control
- Building a Validator so
- CQL
- Profile support
- Deployment configurations
- Subscriptions/Streams

## Docs
* [Quick Start](#quick-start)

## Quick Start

`

## REST

Serotiny exposes a `Rest` service that

## CDS Hooks

Serotiny exposes `Service` and `Card` classes which can be used from the `@sero/cds-hooks` module.

"CDS Hooks" are a protocol separate from FHIR proper, but involve the use of its data structures.

Serotiny automatically scaffolds all of the necessary API routes in the spec when you create a new Service, and exposes a simple, typed function that executes on `hookRequest` events.

Building support for this protocol as a distribution/access channel for novel clinical decision making techniques is super easy with Serotiny. Because of its modular design, CDS Hooks can be run as a totally standalone service: `example/cds-hooks.ts` shows an instance of Serotiny in this configuration.

### Conformance notes
- Discovery service call
- Loading Services from `PlanDefinition` is not currently possible
- Currently passes Touchstone with a warning

### Example

```typescript
import { Service, Card } from "@sero/cds-hooks";

interface PatientPrefetch {
	patient: fhir4.Patient;
}

export default new Service(
	{
		title: "Echo service",
		hook: "patient-view",
		description: "A demo service",
		prefetch: {
			patient: "Patient/{{context.patientId}}"
		}
	},
	(request: CDSHooks.HookRequest<PatientPrefetch>) => {
		const { patient } = request.prefetch;

		return {
			cards: [
				new Card({
					detail: "CDS Card Response",
					source: {
						label: "Serotiny Server",
					},
					summary: "Info"
				})
			]
		}
	}
)
```

## Progress

- Support for /metadata and the Conformance/CapabilityStatement retrieval is working
- Mocked functions for the instance level, type level, and system level REST APIs
- CDS Hooks
  - https://www.hl7.org/fhir/clinicalreasoning-cds-on-fhir.html
  - https://cds-hooks.org/

## Contributing



```
npm install
npm run watch
npm run dev
```

## License

Copyright Automate Medical Inc.
