export const suggestionData = {
  bloodThinner: {
    label: "Create a prescription for Rivaroxaban (Xarelto) 10 MG",
    actions: [
      {
        type: "create",
        description: "Create a prescription for Rivaroxaban (Xarelto) 10 MG",
        resource: {
          resourceType: "MedicationRequest",
          id: "3ba900b2-a795-40a0-8aae-1cfbb02e3ac1",
          status: "active",
          intent: "order",
          medicationCodeableConcept: {
            coding: [
              {
                system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                code: "429503",
                display: "Rivaroxaban 10 MG",
              },
            ],
            text: "Rivaroxaban 10 MG",
          },
          subject: {
            reference: "urn:uuid:b626136e-aff8-4711-8279-536f07f197b5",
          },
          encounter: {
            reference: "urn:uuid:1d05e39c-e269-438c-a9b2-1a485953a2c8",
          },
          authoredOn: "1960-10-23T22:19:43-04:00",
          requester: {
            reference: "urn:uuid:0000016d-3a85-4cca-0000-00000000c5b2",
            display: "Dr. Susan A Clark",
          },
          reasonReference: [
            {
              reference: "urn:uuid:f810df60-74b0-4745-8fb5-cfe7e4c84a1e",
            },
          ],
        },
      },
    ],
    request: {
      method: "POST",
      url: "MedicationRequest",
    },
  },
  aspirin: {
    label: "Create a prescription for Aspirin 80 MG oral Tablet",
    actions: [
      {
        type: "create",
        description: "Create a prescription for Aspirin 80 MG Oral Tablet",
        resource: {
          resourceType: "MedicationRequest",
          id: "16401a10-e311-4287-9986-3988f81b3d7e",
          status: "active",
          intent: "order",
          medicationCodeableConcept: {
            coding: [
              {
                system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                code: "429503",
                display: "Aspirin 80 MG",
              },
            ],
            text: "Aspirin 80 MG",
          },
          subject: {
            reference: "urn:uuid:b626136e-aff8-4711-8279-536f07f197b5",
          },
          encounter: {
            reference: "urn:uuid:1d05e39c-e269-438c-a9b2-1a485953a2c8",
          },
          authoredOn: "1960-10-23T22:19:43-04:00",
          requester: {
            reference: "urn:uuid:0000016d-3a85-4cca-0000-00000000c5b2",
            display: "Dr. Susan A Clark",
          },
          reasonReference: [
            {
              reference: "urn:uuid:f810df60-74b0-4745-8fb5-cfe7e4c84a1e",
            },
          ],
        },
      },
    ],
    request: {
      method: "POST",
      url: "MedicationRequest",
    },
  },
};
