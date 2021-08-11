/* eslint-disable indent */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable tsdoc/syntax */

/**
 *
 * @param {*} patient - patient FHIR object
 * @param {number} age - the patients age
 * @param {number} hscrp - hscrp value
 * @param {number} cholesterol - cholesterol value
 * @param {number} hdlc - hdlc value
 * @param {number} systolicBloodPressure - systolic blood pressure
 * @returns {[number, string]} reynolds risk score - 10-year cardiovascular disease risk
 */
export function reynoldsRiskScore(
  age,
  gender,
  systolicBloodPressure,
  hscrp,
  cholesterol,
  hdlc,
  smoking = false
) {
  // parameter coefficients
  const params =
    gender == "female"
      ? {
          age: 0.0799,
          systolic: 3.137,
          hscrp: 0.18,
          cholesterol: 1.382,
          hdlc: -1.172,
          smoker: 0.818,
        }
      : {
          age: 4.385,
          systolic: 2.607,
          hscrp: 0.102,
          cholesterol: 0.963,
          hdlc: -0.772,
          smoker: 0.405,
        };
  // assign b variables
  const b1 = params.age * (gender == "female" ? age : Math.log(age)),
    b2 = params.systolic * Math.log(systolicBloodPressure),
    b3 = params.hscrp * Math.log(hscrp),
    b4 = params.cholesterol * Math.log(cholesterol),
    b5 = params.hdlc * Math.log(hdlc),
    b6 = params.smoker * (smoking == false ? 0 : 1);
  const B = b1 + b2 + b3 + b4 + b5 + b6;
  // calculate the score based on
  let result =
    gender == "female"
      ? (1 - Math.pow(0.98634, Math.exp(B - 22.325))) * 100
      : (1 - Math.pow(0.899, Math.exp(B - 33.097))) * 100;
  // precision rounding (whole numbers )
  Math.round(
    result < 10
      ? (result = result.toPrecision(1))
      : (result = result.toPrecision(2))
  );
  return [result, getRiskIndicator(result)];
}

/**
 *
 * @param {*} patient - a fhir4 patient
 * @returns {number} - the age of the patient
 */
export function getAge(patient) {
  const ageDate = new Date(Date.now() - new Date(patient.birthDate).getTime());
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/**
 *
 * @param {*} patient  -a fhir patient
 * @returns {string} - the patients gender (male | female)
 */
export function getGender(patient) {
  return patient.gender;
}

/**
 *
 * @param {*} value - a fhir4 bundle for blood pressure
 * @returns {number} - the numerical value of the measurement. There are two components
 * to the blood pressure and we want the systolic blood pressure, or the
 * first item ([0])
 */
export function getBloodPressure(value) {
  return value.entry[0].resource.component[0].valueQuantity.value;
}

/**
 *
 * @param {*} value - a fhir4 bundle for hscrp
 * @returns {number} - the observation value
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
 * @param {*} value - a fhir4 bundle for cholesterol or hdl, as they use the same calculation
 * @returns {number} - the observation value
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
 * @param {*} value - a fhir4 bundle for the smoking status of the patient
 * @returns {number} - the smoking status of the observation (true or false)
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

/**
 *
 * @param {number} riskScore - the reynolds risk score numbered 0-100
 * @returns {string} - card indicator color based on risk score ranges
 */
function getRiskIndicator(riskScore) {
  /**
   * based on "Low", "Moderate", "Moderate-high", "High" risk scores
   * outlined here: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0044347
   */
  if (riskScore < 6) {
    return "info";
  }
  if (riskScore >= 6 && riskScore < 10) {
    return "info";
  }
  if (riskScore >= 10 && riskScore < 20) {
    return "warning";
  }
  return "critical";
}

/**
 *
 * @param {number} riskScore - the reynolds risk score
 * @returns {string} - low, moderate, moderate-high, and high risk score
 */
export function riskThreshold(riskScore) {
  const risk = ["low", "moderate", "moderate-high", "high"];
  if (riskScore < 6) {
    return risk[0];
  }
  if (riskScore >= 6 && riskScore < 10) {
    return risk[1];
  }
  if (riskScore >= 10 && riskScore < 20) {
    return risk[2];
  }
  return risk[3];
}
