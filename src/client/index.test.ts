import Client from ".";

test('Calling Capabilities returns a 200', async () => {
  // @todo this test should use a mock, not the live
  const { capabilities } = Client("https://r4.smarthealthit.org", {})

  const statement = await capabilities()
  const body = await statement.json();

  expect(statement.status).toEqual(200)
  expect(body.resourceType).toEqual("CapabilityStatement")
});

test('Calling Patient query returns some', async () => {
  // @todo this test should use a mock, not the live
  const { searchType, read } = Client("https://r4.smarthealthit.org", {})

  const searchQuery = await searchType("Patient");
  const searchResponse = await searchQuery.json() as fhir4.Bundle;

  expect(searchQuery.status).toEqual(200)
  expect(searchResponse.resourceType).toEqual("Bundle")

  const patientQuery = await read("Patient", "87a339d0-8cae-418e-89c7-8651e6aab3c6");
  const patientResponse = await patientQuery.json() as fhir4.Patient

  expect(patientQuery.status).toEqual(200)
  expect(patientResponse.resourceType).toEqual("Patient")
});