/* eslint-disable tsdoc/syntax */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 *
 * @param {*} patient - a fhir4 patient
 * @returns an array of fhir human names
 * Return an array of patient names from the fhir patient bundle
 */
export function processPatientNames(patient) {
  const patientNames = [];
  patient.name?.forEach((name) => {
    patientNames.push(name);
  });
  return patientNames;
}

/**
 *
 * @param {*} patient - a fhir4 patient
 * @returns an array of fhir addresses
 * Return an array of addresses from the fhir patient bundle
 */
export function processAddresses(patient) {
  const addresses = [];
  patient.address?.forEach((address) => {
    addresses.push(address);
  });
  return addresses;
}

/**
 *
 * @param {*} patient - a fhir4 patient
 * @returns an array of fhir contacts
 * Return an array of contacts from the fhir patient bundle
 */
export function processContacts(patient) {
  const contacts = [];
  patient.contact?.forEach((address) => {
    contacts.push(address);
  });
  return contacts;
}

/**
 *
 * @param {*} patient - a fhir4 patient
 * @returns an array of fhir contact points
 * Return an array of contact points (email and other things) from the fhir patient bundle
 */
export function processTelecom(patient) {
  const telecom = [];
  patient.telecom?.forEach((address) => {
    telecom.push(address);
  });
  return telecom;
}

/**
 *
 * @param {*} encounter - a fhir4 encounter bundle
 * @returns an array of FHIR encounter bundles
 */
export function processEncounters(encounter) {
  const encounters = [];
  encounter.entry?.forEach((entry) => {
    encounters.push(entry);
  });
  return encounters;
}

/**
 *
 * @param {*} encounter
 * @param {number} daysWithoutAppointment
 * @returns boolean value. If the time difference is beyond the entered threshold,
 * true is returned, o/w false
 */
export function newAppointment(encounter, daysWithoutAppointment) {
  const encounterData = processEncounters(encounter);
  // find most recent and compare it to the current date
  const currentDate = new Date();
  const lastVisit = new Date(encounterData.pop().resource.period.start);
  const timeDifference = currentDate.getTime() - lastVisit.getTime();
  const differenceInDays = Math.floor(timeDifference / (1000 * 3600 * 24));
  if (differenceInDays > daysWithoutAppointment)
    return [true, differenceInDays];
  return [false, differenceInDays];
}

/**
 *
 * @param {*} patient
 * @returns an array of identifiers for the patient
 */
export function getUuid(patient) {
  const identifiers = [];
  patient.identifier?.forEach((entry) => {
    identifiers.push(entry);
  });
  return identifiers;
}
