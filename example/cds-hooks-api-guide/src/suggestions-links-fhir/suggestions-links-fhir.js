import { Service, Card } from "@sero.run/sero";

const options = {
  id: "suggestions-links",
  title: "patient view with Reynolds Risk Score assessment",
  hook: "patient-view",
  description:
    "Service triggered on the patient-view hook that calculates Reynolds risk score, and makes a MedicationPrescribe suggestion based on the result. Also provides a link to a SMART app to help work with the result",
  prefetch: {
    patient: "Patient/{{context.patientId}}",
    encounter: "Encounter?subject={{context.patientId}}&_sort=date",
    hscrp: "Observation?code=http://loinc.org|30522-7",
    cholesterolMassOverVolume: "Observation?code=http://loinc.org|2093-3",
    hdl: "Observation?code=http://loinc.org|2085-9",
    systolicBloodPressure: "Observation?code=http://loinc.org|8480-6",
  },
};

const handler = async (request) => {
  const data = request.prefetch;
  const systolic = JSON.stringify(request.prefetch.systolicBloodPressure);
  return {
    cards: [
      // HSCRP data
      new Card({
        detail: `${systolic}`,
        source: {
          label: "Automate Medical, Inc.",
          url: "https://www.automatemedical.com/",
        },
        summary: `HSCRP.`,
        indicator: "info",
      }),
    ],
  };
};

export default new Service(options, handler);
