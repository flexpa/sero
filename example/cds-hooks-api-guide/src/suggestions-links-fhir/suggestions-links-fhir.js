/* eslint-disable indent */

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
import { suggestionData } from "./data.js";

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
  const context = request.context;
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
  /**
   * Defining the cards.
   * This assumes that the reynolds risk score card will be sent every time
   */
  let cards = [
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
          url: "https://smart-cardiac-risk.fly.dev/launch.html",
          type: "smart",
        },
      ],
    }),
  ];
  /**
   * Next, handle adding suggestions
   */
  if (riskScore[1] === "warning" || riskScore[1] === "critical") {
    cards.push(
      new Card({
        detail: `This patient has a ${riskThresholdString} risk of cardiovascular disease over the next 10 years. ${
          riskScore[1] === "warning"
            ? "Consider prescribing an anti-inflammatory like aspirin."
            : "Consider prescribing an anti-inflammatory like aspirin, or even a blood thinner like Xarelto."
        } `,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
          topic: {
            display: "Medication alert",
            version: "0.0.1",
          },
        },
        indicator: riskScore[1],
        summary: "Medication alert",
        suggestions:
          riskScore[1] === "warning"
            ? [suggestionData.aspirin]
            : [suggestionData.aspirin, suggestionData.bloodThinner],
        selectionBehavior: "any",
        overrideReasons: [
          {
            reason: "Not relevant",
            userComment: "",
          },
          {
            reason: "Distracting",
            userComment: "",
          },
        ],
        links:
          riskScore[1] === "warning"
            ? [
                {
                  label: "More information on aspirin",
                  url: "https://medlineplus.gov/druginfo/meds/a682878.html",
                  type: "absolute",
                },
              ]
            : [
                {
                  label: "More information on aspirin",
                  url: "https://medlineplus.gov/druginfo/meds/a682878.html",
                  type: "absolute",
                },
                {
                  label: "More information on blood thinners",
                  url: "https://medlineplus.gov/bloodthinners.html",
                  type: "absolute",
                },
              ],
      })
    );
  }
  // return the set of cards
  return {
    cards: cards,
  };
};

export default new Service(options, handler);
