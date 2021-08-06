/**
 *
 * @param hscrp - hscrp value
 * @param cholesterol - cholesterol value
 * @param hdlc - hdlc value
 * @param systolicBloodPressure - systolic blood pressure
 * @returns reynolds risk score - 10-year cardiovascular disease risk
 */
export function reynoldsRiskScore(
  age,
  systolicBloodPressure,
  hscrp,
  cholesterol,
  hdlc,
  hemoglobinA1c = 0,
  smoking = false,
  familyHistory = false
) {
  let B =
    0.0799 * age +
    3.317 * Math.log(systolicBloodPressure) +
    0.18 * Math.log(hscrp) +
    1.382 * Math.log(cholesterol) -
    1.172 * Math.log(hdlc);
  if (hemoglobinA1c != 0) B += 1.134;
  if (smoking == true) B += 0.818;
  if (familyHistory == true) B += 0.438;
  return B;
}

/**
 *
 * @param patient - fhir Patient
 * @returns number, the patients age
 */
export function getAge(patient) {
  const ageDate = new Date(Date.now() - new Date(patient.birthDate).getTime());
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/**
 *
 * @param value -
 * @returns the numerical value of the measurement
 */
export function getBloodPressure(value) {
  return value.entry[0].resource.component[0].valueQuantity.value;
}

/**
 *
 * @param value -
 * @returns the numerical value of the measurement
 */
export function getHscrp(value) {
  return value.entry[0].resource.valueQuantity.value;
}
