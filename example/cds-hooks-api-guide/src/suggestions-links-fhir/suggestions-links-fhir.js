import { Service, Card } from "@sero.run/sero";
import { processPatientNames } from "./util.js";

export default new Service(
  {
    id: "suggestions-links-fhir",
    title: "Launch a SMART app from determining Reynolds Risk score",
    hook: "patient-view",
    description:
      "A patient-view hook with prefetch values helping to determine Reynolds risk score. Launches a SMART app to help put results in context",
    prefetch: {
      patient: "Patient/{{context.patientId}}",
      encounter: "Encounter?subject={{context.patientId}}&_sort=date",
      hscrp: "Observation?code=http://loinc.org|30522-7",
      cholesterolMassOverVolume: "Observation?code=http://loinc.org|2093-3",
      hdl: "Observation?code=http://loinc.org|2085-9",
      systolicBloodPressure: "Observation?code=http://loinc.org|8480-6",
    },
  },
  (request) => {
    const data = request.prefetch;
    const systolic = JSON.stringify(request.prefetch.systolicBloodPressure);
    const patientNames = processPatientNames(data.patient);
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
        // Name(s)
        new Card({
          detail: `This patient has ${patientNames.length} name${
            patientNames.length <= 1 ? "" : "s"
          } on record.`,
          source: {
            label: "Automate Medical, Inc.",
            url: "https://www.automatemedical.com/",
          },
          summary: `Now seeing: ${patientNames[0].given} ${patientNames[0].family}.`,
          indicator: "info",
        }),
      ],
    };
  }
);
