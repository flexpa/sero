import { Service, Card } from "@sero.run/sero";
import {
  reynoldsRiskScore,
  getAge,
  getBloodPressure,
  getHscrp,
  getCholesterolAndHdl,
  getSmokingStatus,
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
      "Observation?code=http://loinc.org|2093-3&&_sort=date",
    hdl: "Observation?code=http://loinc.org|2085-9&_sort=date",
    bloodPressure: "Observation?code=http://loinc.org|55284-4&_sort=date",
    smokingStatus: "Observation?code=http://loinc.org|72166-2&_sort=date",
  },
};

const handler = async (request) => {
  const data = request.prefetch;
  const age = getAge(data.patient);
  const systolic = getBloodPressure(data.bloodPressure);
  const hscrp = getHscrp(data.hscrp);
  const cholesterol = getCholesterolAndHdl(data.cholesterolMassOverVolume);
  const hdlc = getCholesterolAndHdl(data.hdl);
  const smokingStatus = getSmokingStatus(data.smokingStatus);
  const riskScore = reynoldsRiskScore(
    data.patient,
    age,
    systolic,
    hscrp,
    cholesterol,
    hdlc,
    smokingStatus
  );
  // defining the cards
  let cards = [];
  if (riskScore >= 30) {
    // push the link card
    cards.push(
      new Card({
        detail: `More information on this score:`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Reynolds risk score: ${riskScore}`,
        indicator: "warning",
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
        detail: `This patient has a high risk of cardiovascular disease. Consider prescribing a blood thinner.`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        indicator: "warning",
        summary: "Medication alert",
        suggestions: [
          {
            label: "Create a prescription for Acetaminophen 250 MG",
            type: "create",
            description: "Create a prescription for Acetaminophen 250 MG",
            fullUrl: "urn:uuid:3ba900b2-a795-40a0-8aae-1cfbb02e3ac1",
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
                    display: "Hydrochlorothiazide 12.5 MG",
                  },
                ],
                text: "Hydrochlorothiazide 12.5 MG",
              },
              subject: {
                reference: "urn:uuid:763b6101-133a-44bb-ac60-3c097d6c0ba1",
              },
              encounter: {
                reference: "urn:uuid:09febec4-11a0-41b4-a5ef-5dabf8ffaf3e",
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
            request: {
              method: "POST",
              url: "MedicationRequest",
            },
          },
        ],
      })
    );
  } else {
    // push just the link card if the patients score is on the lower side
    cards.push(
      new Card({
        detail: `More information on this score:`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Reynolds risk score: ${riskScore}`,
        indicator: "info",
        links: [
          {
            label: "Launch cardiac health SMART app",
            url: "https://divine-meadow-3697.fly.dev/launch.html",
            type: "smart",
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
