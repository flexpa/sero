/**
 *
 * @param patient - patient FHIR object
 * @param age - the patients age
 * @param hscrp - hscrp value
 * @param cholesterol - cholesterol value
 * @param hdlc - hdlc value
 * @param systolicBloodPressure - systolic blood pressure
 * @returns reynolds risk score - 10-year cardiovascular disease risk
 */
export function reynoldsRiskScore(
  patient,
  age,
  systolicBloodPressure,
  hscrp,
  cholesterol,
  hdlc,
  smoking = false
) {
  let params, result;
  // parameter coefficients based on gender
  if (patient.gender == "female") {
    params = {
      age: 0.0799,
      systolic: 3.137,
      hscrp: 0.18,
      cholesterol: 1.382,
      hdlc: -1.172,
      smoker: 0.818,
    };
  } else {
    params = {
      age: 4.385,
      systolic: 2.607,
      hscrp: 0.102,
      cholesterol: 0.963,
      hdlc: -0.772,
      smoker: 0.405,
    };
  }
  // assign b variables
  let b1 = params.age * (patient.gender == "female" ? age : Math.log(age)),
    b2 = params.systolic * Math.log(systolicBloodPressure),
    b3 = params.hscrp * Math.log(hscrp),
    b4 = params.cholesterol * Math.log(cholesterol),
    b5 = params.hdlc * Math.log(hdlc),
    b6 = params.smoker * (smoking == false ? 0 : 1);
  let B = b1 + b2 + b3 + b4 + b5 + b6;
  // calculate the score based on
  if (patient.gender === "female") {
    result = (1 - Math.pow(0.98634, Math.exp(B - 22.325))) * 100;
  } else {
    result = (1 - Math.pow(0.899, Math.exp(B - 33.097))) * 100;
  }
  return Math.round(
    result < 10 ? result.toPrecision(1) : result.toPrecision(2)
  );
}
/**
 *
 * @param patient - a fhir4 patient
 * @returns the age of the patient
 */
export function getAge(patient) {
  const ageDate = new Date(Date.now() - new Date(patient.birthDate).getTime());
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/**
 *
 * @param value - a fhir4 bundle for blood pressure
 * @returns the numerical value of the measurement. There are two components
 * to the blood pressure and we want the systolic blood pressure, or the
 * first item ([0])
 */
export function getBloodPressure(value) {
  return value.entry[0].resource.component[0].valueQuantity.value;
}

/**
 *
 * @param value - a fhir4 bundle for hscrp
 * @returns - the observation value
 */
export function getHscrp(value) {
  if (value.entry[0].resource.valueQuantity.unit === "mg/L") {
    return value.entry[0].resource.valueQuantity.value;
  } else if (value.entry[0].resource.valueQuantity.unit === "mmol/L") {
    return value.entry[0].resource.valueQuantity.value / 0.1;
  }
  throw `Unanticipated units for Hscrp: ${value.entry[0].resource.valueQuantity.unit}`;
}

/**
 *
 * @param value - a fhir4 bundle for cholesterol or hdl, as they use the same calculation
 * @returns - the observation value
 */
export function getCholesterolAndHdl(value) {
  if (value.entry[0].resource.valueQuantity.unit === "mg/dL") {
    return value.entry[0].resource.valueQuantity.value;
  } else if (value.entry[0].resource.valueQuantity.unit === "mmol/L") {
    return value.entry[0].resource.valueQuantity.value / 0.026;
  }
  throw `Unanticipated cholesterol units: ${value.entry[0].resource.valueQuantity.unit}`;
}

/**
 *
 * @param value - a fhir4 bundle for the smoking status of the patient
 * @returns the smoking status of the observation (true or false)
 */
export function getSmokingStatus(value) {
  if (
    value.entry[0].resource.valueCodeableConcept.coding[0].display ==
    "Never smoker"
  ) {
    return false;
  } else {
    return true;
  }
}
