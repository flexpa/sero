import { Card } from "../../src/cds-hooks";

/**
 * Card detail interface has a generic type definition
 */
export interface CardDetail<T> {
  summary: string;
  detail: string;
}

/**
 * Define an index signature to help with the patient properties
 */
export interface PatientProperties {
  [key: string]: keyof fhir4.Patient;
}

/**
 * first, get all of the properties that are present in the response
 * then, construct cards out of that information with some default details
 * (summary is property key/title, and detail is the property value)
 * send that back to the service to render to the client
 * @param patient - a fhir patient
 * @returns an array of informative cards, one card for every property
 * @todo scaffold to get specific detail for each patient property that is
 * included in the response, and no explicit any
 */
export function buildPatient(patient: any): Array<Card> {
  const cards: Array<Card> = [];
  const keys = Object.keys(patient);
  const source: CDSHooks.Source = {
    label: "Automate Medical, Inc.",
    url: "https://www.automatemedical.com/",
  };
  console.log(keys);
  keys.forEach((key) => {
    // const summaryDetail = summaryAndDetail(key);
    if (key in patient) {
      cards.push(
        new Card({
          source: source,
          summary: `${patient[key]}`,
          detail: `${patient[key]}`,
          indicator: `info`,
        })
      );
    }
  });
  return cards;
}

/**
 *
 * @param patient - a fhir patient
 * @returns an array of fhir human names
 * Return an array of patient names from the fhir patient bundle
 */
export function processPatientNames(
  patient: fhir4.Patient
): Array<fhir4.HumanName> {
  const patientNames: Array<fhir4.HumanName> = [];
  patient.name?.forEach((name) => {
    patientNames.push(name);
  });
  return patientNames;
}
