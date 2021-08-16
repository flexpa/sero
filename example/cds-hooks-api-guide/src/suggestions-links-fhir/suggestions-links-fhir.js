import { Service, Card } from "@sero.run/sero";
import {
  reynoldsRiskScore,
  getAge,
  getGender,
  getBloodPressure,
  getHscrp,
  getCholesterolAndHdl,
  getSmokingStatus,
  riskThreshold,
} from "./util.js";

const options = {
  id: "suggestions-links",
  title: "patient view with Reynolds Risk Score assessment",
  hook: "patient-view",
  description:
    "Service triggered on the patient-view hook that calculates Reynolds risk score, and makes a MedicationPrescribe suggestion based on the result. Also provides a link to a SMART app to help work with the result",
  prefetch: {
    patient: "Patient/{{context.patientId}}",
    hscrp: "Observation?code=http://loinc.org|30522-7&_sort=date",
    cholesterolMassOverVolume:
      "Observation?code=http://loinc.org|2093-3&_sort=date",
    hdl: "Observation?code=http://loinc.org|2085-9&_sort=date",
    bloodPressure: "Observation?code=http://loinc.org|55284-4&_sort=date",
    smokingStatus: "Observation?code=http://loinc.org|72166-2&_sort=date",
  },
};

const handler = async (request) => {
  const data = request.prefetch;
  const age = getAge(data.patient);
  const gender = getGender(data.patient);
  const systolic = getBloodPressure(data.bloodPressure);
  const hscrp = getHscrp(data.hscrp);
  const cholesterol = getCholesterolAndHdl(data.cholesterolMassOverVolume);
  const hdlc = getCholesterolAndHdl(data.hdl);
  const smokingStatus = getSmokingStatus(data.smokingStatus);
  const riskScore = reynoldsRiskScore(
    age,
    gender,
    systolic,
    hscrp,
    cholesterol,
    hdlc,
    smokingStatus
  );
  const riskThresholdString = riskThreshold(riskScore[0]);
  // defining the cards
  let cards = [];
  if (riskScore[1] == "info") {
    // push just the link card if the patients score is on the lower side
    cards.push(
      new Card({
        detail: `More information on this score:`,
        source: {
          label: "Reynold's Risk Score",
          url: "https://pubmed.ncbi.nlm.nih.gov/17299196/",
        },
        summary: `Reynolds risk score: ${riskScore[0]}`,
        indicator: riskScore[1],
        links: [
          {
            label: "Launch cardiac health SMART app",
            url: "https://divine-meadow-3697.fly.dev/launch.html",
            type: "smart",
          },
        ],
      })
    );
  } else if (riskScore[1] == "warning") {
    // push the link card
    cards.push(
      new Card({
        detail: `More information on this score:`,
        source: {
          label: "Reynold's Risk Score",
          url: "https://pubmed.ncbi.nlm.nih.gov/17299196/",
        },
        summary: `Reynolds risk score: ${riskScore[0]}`,
        indicator: riskScore[1],
        links: [
          {
            label: "Launch cardiac health SMART app",
            url: "https://divine-meadow-3697.fly.dev/launch.html",
            type: "smart",
          },
        ],
      })
    );
    // push the suggestion card
    cards.push(
      new Card({
        detail: `This patient has a ${riskThresholdString} risk of cardiovascular disease over the next 10 years. Consider prescribing an anti-inflammatory like aspirin.`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        indicator: riskScore[1],
        summary: "Medication alert",
        suggestions: [
          {
            label: "Create a prescription for Aspirin 80 MG oral Tablet",
            actions: [
              {
                type: "create",
                description:
                  "Create a prescription for Aspirin 80 MG Oral Tablet",
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
                      reference:
                        "urn:uuid:f810df60-74b0-4745-8fb5-cfe7e4c84a1e",
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
        ],
        links: [
          {
            label: "More information on aspirin",
            url: "https://medlineplus.gov/druginfo/meds/a682878.html",
            type: "absolute",
          },
        ],
      })
    );
  } else {
    // push the link card
    cards.push(
      new Card({
        detail: `More information on this score:`,
        source: {
          label: "Reynold's Risk Score",
          url: "https://pubmed.ncbi.nlm.nih.gov/17299196/",
        },
        summary: `Reynolds risk score: ${riskScore[0]}`,
        indicator: riskScore[1],
        links: [
          {
            label: "Launch cardiac health SMART app",
            url: "https://divine-meadow-3697.fly.dev/launch.html",
            type: "smart",
          },
        ],
      })
    );
    // push the suggestion card
    cards.push(
      new Card({
        detail: `This patient has a ${riskThresholdString} risk of cardiovascular disease over the next 10 years. Consider prescribing a anticoagulant like Xarelto.`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        indicator: riskScore[1],
        summary: "Medication alert",
        suggestions: [
          {
            label: "Create a prescription for Rivaroxaban (Xarelto) 10 MG",
            actions: [
              {
                type: "create",
                description:
                  "Create a prescription for Rivaroxaban (Xarelto) 10 MG",
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
                      reference:
                        "urn:uuid:f810df60-74b0-4745-8fb5-cfe7e4c84a1e",
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
        ],
        links: [
          {
            label: "More information on blood thinners",
            url: "https://medlineplus.gov/bloodthinners.html",
            type: "absolute",
          },
        ],
      })
    );
  }
  return {
    cards: cards,
  };
};

export default new Service(options, handler);
