import { Card } from "../../src/cds-hooks";

/**
 * Card detail interface has a generic type definition
 */
export interface CardDetail<T> {
  summary: T;
  detail: T;
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
export function buildPatient(patient: fhir4.Patient): Array<Card> {
  const cards: Array<Card> = [];
  const keys = Object.keys(patient);
  const source = {
    label: "Automate Medical, LLC",
    url: "https://www.automatemedical.com/",
  };
  console.log(keys);
  keys.forEach((key) => {
    // const summaryDetail = summaryAndDetail(key);
    if (key in patient) {
      const [summary, detail] = summaryAndDetail(key, patient);
      cards.push(
        new Card({
          source: source,
          summary: summary,
          detail: detail,
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

export function summaryAndDetail(arg: string, patient: fhir4.Patient): any[] {
  const summaryDetail: Partial<CardDetail<any>> = {};
  switch (arg) {
  case "resourceType":
    summaryDetail.summary = patient[arg];
    summaryDetail.detail = patient[arg];
    return [summaryDetail.summary, summaryDetail.detail];
  case "id":
    summaryDetail.summary = patient[arg];
    summaryDetail.detail = patient[arg];
    return [summaryDetail.summary, summaryDetail.detail];
  case "`meta`":
    summaryDetail.summary = patient[arg];
    summaryDetail.detail = patient[arg];
    return [summaryDetail.summary, summaryDetail.detail];
  case "`text`":
    summaryDetail.summary = patient[arg];
    summaryDetail.detail = patient[arg];
    return [summaryDetail.summary, summaryDetail.detail];
  case "`identifier`":
    summaryDetail.summary = patient[arg];
    summaryDetail.detail = patient[arg];
    return [summaryDetail.summary, summaryDetail.detail];
  case "active":
    summaryDetail.summary = patient[arg];
    summaryDetail.detail = patient[arg];
    return [summaryDetail.summary, summaryDetail.detail];
  case "name":
    summaryDetail.summary = patient[arg];
    summaryDetail.detail = patient[arg];
    return [summaryDetail.summary, summaryDetail.detail];
  case "telecom":
    summaryDetail.summary = patient[arg];
    summaryDetail.detail = patient[arg];
    return [summaryDetail.summary, summaryDetail.detail];
  case "gender":
    summaryDetail.summary = patient[arg];
    summaryDetail.detail = patient[arg];
    return [summaryDetail.summary, summaryDetail.detail];
  case "birthDate":
    summaryDetail.summary = patient[arg];
    summaryDetail.detail = patient[arg];
    return [summaryDetail.summary, summaryDetail.detail];
  case "address":
    summaryDetail.summary = patient[arg];
    summaryDetail.detail = patient[arg];
    return [summaryDetail.summary, summaryDetail.detail];
  case "generalPractitioner":
    summaryDetail.summary = patient[arg];
    summaryDetail.detail = patient[arg];
    return [summaryDetail.summary, summaryDetail.detail];
  default:
    break;
  }
}
