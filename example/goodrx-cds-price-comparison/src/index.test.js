const { Http, CDSHooks } = require("@sero.run/sero/dist/cjs/index.js")

const goodRxComparePriceService = require("./good-rx-compare-price.ts");

const config = {
  cdsHooks: {
    services: [
        goodRxComparePriceService
    ],
    cors: true
  }
}

const app = Http(config);
CDSHooks(config, app);

test('An EPIC Medication Request test', async () => {
  // This maps up to patient-view

  const response = await app.inject({
    method: 'POST',
    url: '/cds-services/good-rx-comparison',
    payload: {
      "hookInstance": "3f1dde72-162b-11ec-99e8-0050568b7be6",
      "fhirServer": "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/R4",
      "hook": "order-select",
      "fhirAuthorization": {
          "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1cm46ZXBpYzphcHBvcmNoYXJkLmN1cnByb2QiLCJjbGllbnRfaWQiOiJjb25uZWN0YXRob24tc2VwdGVtYmVyLTIwMjEiLCJlcGljLmVjaSI6InVybjplcGljOkN1cnJlbnQtQXBwLU9yY2hhcmQtUHJvZHVjdGlvbiIsImVwaWMubWV0YWRhdGEiOiJna0p1aU9rMzBET1lOXzg1VzFYejl1d1I4UXJILURMSjFIQU1zU0NxbEI2NWl6blNpYWd2N2JlMnNkR0QtZzh3U04ybWp1blpnVlRfSzBwV1FUMm43ajg2ZENCc1lxYkVGOXBfZ0V4cVpNdzVTZGRUREY1QjN3dFlrMVNsSzdpdiIsImVwaWMudG9rZW50eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjMxNzE3MTU0LCJpYXQiOjE2MzE3MTM1NTQsImlzcyI6InVybjplcGljOmFwcG9yY2hhcmQuY3VycHJvZCIsImp0aSI6IjljNzE3M2I2LTU4MjUtNDQ5NC1hYTc1LWJkODM4MmU3Y2E2NyIsIm5iZiI6MTYzMTcxMzU1NCwic3ViIjoiZWlHdEFHQVl1ZXYzTTBPalJJandOSmczIn0.mx1-qDtTQu293iaZRYPkNsxYWxvNIqz76cUbCgUQsKFE_4-op5Je8vY63qWpshd_5wIGprkZdjUX3tMc4c_-0UcrWwqX1WkHanC_aMu04eSNYNbtS8fYEZEKZTc6tFNeFzLoKrovqH_QQvFffOxXURHhya1C-QfGXMZePP9pgAYY_UZErPVin3bMgvOsTaQucj3xPRB-ZpRcs7dHMv300rpw7jw7FZpCxGwIbdk03JlMD0QigWeBkVZ7rd-oKQSPdKS7qUsk7EyuXinEe5CXheflfdISZ-p57ReThbpVNUCUnMPWTRYQVLuPwF6iMeOfz-h8ZIoVtxj2R_Doncfwtw",
          "token_type": "Bearer",
          "expires_in": 3600,
          "scope": "user/AllergyIntolerance.Read user/Condition.Read user/Encounter.Read user/Immunization.Read user/Medication.Read user/MedicationRequest.Read user/Observation.Read user/Patient.Read user/Practitioner.Read user/ServiceRequest.Read",
          "subject": "connectathon-september-2021"
      },
      "context": {
          "patientId": "el0VeGTE1vcmdn5N.BKPUFg3",
          "encounterId": "ejHSgHTi-oTHAIeAOzTmnCA3",
          "userId": "Practitioner/eiGtAGAYuev3M0OjRIjwNJg3",
          "selections": ["MedicationRequest/ewfTRiRrfssgO6Y0r-cxLbp5kDQmv3G.DWykc36adgLxY.pizp-g.Nb6qK5jc4RC3g-CcTa4bn.SBsJwsZcoGwRSM1Rini2bp2NfS-Kkbu8xJwakSB.R8b5SbPiplw7tHQEad6hDec3ShdIWd0CKeXh1uN5Fq0Ru9Wzy7mOwVN0CNAvul7ntuNk9EiWO055Cx3"],
          "draftOrders": {
              "resourceType": "Bundle",
              "type": "collection",
              "entry": [{
                      "resource": {
                          "resourceType": "MedicationRequest",
                          "id": "ewfTRiRrfssgO6Y0r-cxLbqMEdISdZGclkK.RAwQJrMKCn8K8b8LTn1oxcmMVWM9OR.7Syp1qPzzeaB14e8yv8uA7VYUX.328FTNQZRi7szPPN0L0KQCHDeRUNY.vmDCp4d6NBIJZY4CZgORK.rCcw0Xe2gRHGPmfu3SAIw-5XyNSFom-.-HouEc9NdEgAMBm3",
                          "status": "draft",
                          "intent": "order",
                          "category": [{
                                  "coding": [{
                                          "system": "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                                          "code": "inpatient",
                                          "display": "Inpatient"
                                      }
                                  ],
                                  "text": "Inpatient"
                              }
                          ],
                          "medicationReference": {
                              "reference": "Medication/epB4yoDKZsUL25R7hwVJBNg3",
                              "display": "ACETAMINOPHEN 325 MG PO TABS"
                          },
                          "subject": {
                              "reference": "Patient/el0VeGTE1vcmdn5N.BKPUFg3",
                              "display": "Willow, Eric E"
                          },
                          "encounter": {
                              "reference": "Encounter/ejHSgHTi-oTHAIeAOzTmnCA3"
                          },
                          "requester": {
                              "extension": [{
                                      "valueCode": "unknown",
                                      "url": "http://hl7.org/fhir/StructureDefinition/data-absent-reason"
                                  }
                              ]
                          },
                          "recorder": {
                              "reference": "Practitioner/eiGtAGAYuev3M0OjRIjwNJg3",
                              "display": "Matthew Sargent"
                          },
                          "dosageInstruction": [{
                                  "timing": {
                                      "repeat": {
                                          "boundsPeriod": {
                                              "start": "2021-09-15T13:42:31Z"
                                          },
                                          "frequency": 1,
                                          "period": 6,
                                          "periodUnit": "h"
                                      },
                                      "code": {
                                          "text": "Every 6 hours as needed"
                                      }
                                  },
                                  "asNeededBoolean": true,
                                  "route": {
                                      "coding": [{
                                              "system": "urn:oid:1.2.840.114350.1.13.0.1.7.4.798268.7025",
                                              "code": "15",
                                              "display": "Oral"
                                          }, {
                                              "system": "http://snomed.info/sct",
                                              "code": "260548002",
                                              "display": "Oral"
                                          }
                                      ],
                                      "text": "Oral"
                                  },
                                  "doseAndRate": [{
                                          "type": {
                                              "coding": [{
                                                      "system": "http://epic.com/CodeSystem/dose-rate-type",
                                                      "code": "calculated",
                                                      "display": "calculated"
                                                  }
                                              ],
                                              "text": "calculated"
                                          },
                                          "doseQuantity": {
                                              "value": 650,
                                              "unit": "mg",
                                              "system": "http://unitsofmeasure.org",
                                              "code": "mg"
                                          }
                                      }, {
                                          "type": {
                                              "coding": [{
                                                      "system": "http://epic.com/CodeSystem/dose-rate-type",
                                                      "code": "admin-amount",
                                                      "display": "admin-amount"
                                                  }
                                              ],
                                              "text": "admin-amount"
                                          },
                                          "doseQuantity": {
                                              "value": 2,
                                              "unit": "tablet",
                                              "system": "http://unitsofmeasure.org",
                                              "code": "{tbl}"
                                          }
                                      }, {
                                          "type": {
                                              "coding": [{
                                                      "system": "http://epic.com/CodeSystem/dose-rate-type",
                                                      "code": "ordered",
                                                      "display": "ordered"
                                                  }
                                              ],
                                              "text": "ordered"
                                          },
                                          "doseQuantity": {
                                              "value": 650,
                                              "unit": "mg",
                                              "system": "http://unitsofmeasure.org",
                                              "code": "mg"
                                          }
                                      }
                                  ]
                              }
                          ]
                      }
                  }, {
                      "resource": {
                          "resourceType": "MedicationRequest",
                          "id": "ewfTRiRrfssgO6Y0r-cxLbp5kDQmv3G.DWykc36adgLxY.pizp-g.Nb6qK5jc4RC3g-CcTa4bn.SBsJwsZcoGwRSM1Rini2bp2NfS-Kkbu8xJwakSB.R8b5SbPiplw7tHQEad6hDec3ShdIWd0CKeXh1uN5Fq0Ru9Wzy7mOwVN0CNAvul7ntuNk9EiWO055Cx3",
                          "status": "draft",
                          "intent": "order",
                          "category": [{
                                  "coding": [{
                                          "system": "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                                          "code": "inpatient",
                                          "display": "Inpatient"
                                      }
                                  ],
                                  "text": "Inpatient"
                              }
                          ],
                          "medicationReference": {
                              "reference": "Medication/eSFdHMHI0t3Y2NILZLgNVLg3",
                              "display": "CODEINE SULFATE 15 MG PO TABS"
                          },
                          "subject": {
                              "reference": "Patient/el0VeGTE1vcmdn5N.BKPUFg3",
                              "display": "Willow, Eric E"
                          },
                          "encounter": {
                              "reference": "Encounter/ejHSgHTi-oTHAIeAOzTmnCA3"
                          },
                          "requester": {
                              "extension": [{
                                      "valueCode": "unknown",
                                      "url": "http://hl7.org/fhir/StructureDefinition/data-absent-reason"
                                  }
                              ]
                          },
                          "recorder": {
                              "reference": "Practitioner/eiGtAGAYuev3M0OjRIjwNJg3",
                              "display": "Matthew Sargent"
                          },
                          "dosageInstruction": [{
                                  "timing": {
                                      "repeat": {
                                          "boundsPeriod": {
                                              "start": "2021-09-15T13:45:53Z"
                                          },
                                          "frequency": 1,
                                          "period": 4,
                                          "periodUnit": "h"
                                      },
                                      "code": {
                                          "text": "Every 4 (four) hours as needed"
                                      }
                                  },
                                  "asNeededBoolean": true,
                                  "route": {
                                      "coding": [{
                                              "system": "urn:oid:1.2.840.114350.1.13.0.1.7.4.798268.7025",
                                              "code": "15",
                                              "display": "Oral"
                                          }, {
                                              "system": "http://snomed.info/sct",
                                              "code": "260548002",
                                              "display": "Oral"
                                          }
                                      ],
                                      "text": "Oral"
                                  },
                                  "doseAndRate": [{
                                          "type": {
                                              "coding": [{
                                                      "system": "http://epic.com/CodeSystem/dose-rate-type",
                                                      "code": "calculated",
                                                      "display": "calculated"
                                                  }
                                              ],
                                              "text": "calculated"
                                          },
                                          "doseQuantity": {
                                              "value": 30,
                                              "unit": "mg",
                                              "system": "http://unitsofmeasure.org",
                                              "code": "mg"
                                          }
                                      }, {
                                          "type": {
                                              "coding": [{
                                                      "system": "http://epic.com/CodeSystem/dose-rate-type",
                                                      "code": "admin-amount",
                                                      "display": "admin-amount"
                                                  }
                                              ],
                                              "text": "admin-amount"
                                          },
                                          "doseQuantity": {
                                              "value": 2,
                                              "unit": "tablet",
                                              "system": "http://unitsofmeasure.org",
                                              "code": "{tbl}"
                                          }
                                      }, {
                                          "type": {
                                              "coding": [{
                                                      "system": "http://epic.com/CodeSystem/dose-rate-type",
                                                      "code": "ordered",
                                                      "display": "ordered"
                                                  }
                                              ],
                                              "text": "ordered"
                                          },
                                          "doseQuantity": {
                                              "value": 30,
                                              "unit": "mg",
                                              "system": "http://unitsofmeasure.org",
                                              "code": "mg"
                                          }
                                      }
                                  ]
                              }
                          ]
                      }
                  }
              ]
          }
      },
      "extension": {
          "com.epic.cdshooks.request.bpa-trigger-action": "18",
          "com.epic.cdshooks.request.cds-hooks-specification-version": "1.1",
          "com.epic.cdshooks.request.fhir-version": "R4",
          "com.epic.cdshooks.request.criteria-id": "1126",
          "com.epic.cdshooks.request.epic-version": "9.8",
          "com.epic.cdshooks.request.cds-hooks-implementation-version": "1.2",
          "com.epic.cdshooks.request.cds-hooks-su-version": "0",
          "internal.epic.cdshooks.request.epic-emp-id": "14977"
      }
  }
  });

  const body = JSON.parse(response.body);

  expect(response.statusCode).toEqual(200)
//   expect(body).toEqual({"statusCode":400,"error":"Bad Request","message":"body.hook should be equal to one of the allowed values"})
})