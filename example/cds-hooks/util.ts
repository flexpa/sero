import { Card } from "../../src/cds-hooks";

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

// in general the functions below avoid the "possibly undefined error"

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

/**
 *
 * @param patient - a fhir patient
 * @returns an array of fhir addresses
 * Return an array of addresses from the fhir patient bundle
 */
export function processAddresses(patient: fhir4.Patient): Array<fhir4.Address> {
  const addresses: Array<fhir4.Address> = [];
  patient.address?.forEach((address) => {
    addresses.push(address);
  });
  return addresses;
}

/**
 *
 * @param patient - a fhir patient
 * @returns an array of fhir contacts
 * Return an array of contacts from the fhir patient bundle
 */
export function processContacts(
  patient: fhir4.Patient
): Array<fhir4.PatientContact> {
  const contacts: Array<fhir4.PatientContact> = [];
  patient.contact?.forEach((address) => {
    contacts.push(address);
  });
  return contacts;
}

/**
 *
 * @param patient - a fhir patient
 * @returns an array of fhir contact points
 * Return an array of contact points (email and other things) from the fhir patient bundle
 */
export function processTelecom(
  patient: fhir4.Patient
): Array<fhir4.ContactPoint> {
  const telecom: Array<fhir4.ContactPoint> = [];
  patient.telecom?.forEach((address) => {
    telecom.push(address);
  });
  return telecom;
}

/**
 * Card detail interface has a generic type definition
 * @todo - help with scaffolding cards with generic types
 */
export interface CardDetail<T> {
  summary: T;
  detail: T;
}

/**
 * Define an index signature to help with the patient properties
 * @todo - patient has different properties, this will help with generalizing card creation
 */
export interface PatientProperties {
  [key: string]: keyof fhir4.Patient;
}
