import { Service, Card } from "@sero.run/sero";
import {
  reynoldsRiskScore,
  getAge,
  getBloodPressure,
  getHscrp,
  reynoldsRiskScore,
} from "./util.js";

const options = {
  id: "suggestions-links",
  title: "patient view with Reynolds Risk Score assessment",
  hook: "patient-view",
  description:
    "Service triggered on the patient-view hook that calculates Reynolds risk score, and makes a MedicationPrescribe suggestion based on the result. Also provides a link to a SMART app to help work with the result",
  prefetch: {
    patient: "Patient/{{context.patientId}}",
    hscrp: "Observation?code=http://loinc.org|30522-7",
    cholesterolMassOverVolume: "Observation?code=http://loinc.org|2093-3",
    hdl: "Observation?code=http://loinc.org|2085-9",
    bloodPressure: "Observation?code=http://loinc.org|55284-4",
  },
};

const handler = async (request) => {
  const data = request.prefetch;
  const age = getAge(data.patient);
  const systolic = getBloodPressure(data.bloodPressure);
  const hscrp = getHscrp(data.hscrp);
  const reynoldsRiskScore = reynoldsRiskScore(age, systolic, hscrp);
  return {
    cards: [
      // Age
      new Card({
        detail: `Age`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Systolic BP: ${age}`,
        indicator: "info",
        links: [
          {
            label: "Reynolds Risk Score",
            url: "https://divine-meadow-3697.fly.dev/launch.html",
            type: "smart",
          },
        ],
      }),
      // Systolic blood pressure data
      new Card({
        detail: `Systolic blood pressure`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Systolic BP: ${systolic}`,
        indicator: "info",
        links: [
          {
            label: "Reynolds Risk Score",
            url: "https://divine-meadow-3697.fly.dev/launch.html",
            type: "smart",
          },
        ],
      }),
      new Card({
        detail: `This is where the systolic information would go...`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `Systolic BP: ${hscrp}`,
        indicator: "info",
        links: [
          {
            label: "Reynolds Risk Score",
            url: "https://divine-meadow-3697.fly.dev/launch.html",
            type: "smart",
          },
        ],
      }),
    ],
  };
};

export default new Service(options, handler);
